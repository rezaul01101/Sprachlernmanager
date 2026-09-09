#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/var/www/html

echo "[entrypoint] Preparing filesystem permissions..."
mkdir -p "$APP_DIR"/storage/framework/{cache,sessions,views} "$APP_DIR"/storage/logs "$APP_DIR"/bootstrap/cache
chown -R www-data:www-data "$APP_DIR"/storage "$APP_DIR"/bootstrap/cache

if [ ! -f "$APP_DIR/.env" ]; then
    echo "[entrypoint] No .env file found at $APP_DIR/.env — bind-mount your local .env.docker there and restart." >&2
    exit 1
fi

if ! grep -q "^APP_KEY=base64:" "$APP_DIR/.env"; then
    if [ "${APP_ENV:-production}" = "production" ]; then
        # Auto-generating a key in production is exactly the kind of thing that
        # silently breaks encrypted sessions/cookies across restarts or multiple
        # instances — fail loudly instead and make the operator set one deliberately.
        echo "[entrypoint] APP_KEY is missing in $APP_DIR/.env. Run 'php artisan key:generate --show' locally and set it before starting production." >&2
        exit 1
    fi
    echo "[entrypoint] No APP_KEY set — generating one (development only)."
    php "$APP_DIR/artisan" key:generate --force
    # docker-compose's env_file already injected the (empty) APP_KEY from
    # .env.docker's original content as a real process environment variable
    # before this script even ran. phpdotenv's immutable-by-default loading
    # won't let the file's new value override an already-set env var, even
    # an empty one — so re-export it here, into this process's own
    # environment, which `exec` below then hands down to supervisord and
    # everything it spawns.
    export APP_KEY
    APP_KEY=$(grep "^APP_KEY=" "$APP_DIR/.env" | cut -d= -f2-)
fi

# --- Development convenience -----------------------------------------------
# The dev image bind-mounts the host repo over /var/www/html, which shadows
# whatever vendor/node_modules the image itself had. On a fresh clone (or the
# first time the bind mount is used) those directories won't exist yet.
if [ "${APP_ENV:-production}" != "production" ]; then
    if [ ! -d "$APP_DIR/vendor" ]; then
        echo "[entrypoint] vendor/ missing — running composer install."
        composer install --working-dir="$APP_DIR"
    fi
    # node_modules is a named volume (not the bind mount), so the directory
    # always exists and can pick up stray files (e.g. Vite's own .vite-temp)
    # across restarts even with no packages installed — check for npm's own
    # completion marker instead of just "is it empty".
    if [ ! -f "$APP_DIR/node_modules/.package-lock.json" ]; then
        echo "[entrypoint] node_modules/ not installed — running npm install."
        (cd "$APP_DIR" && npm install)
    fi
fi

# --- Migrations --------------------------------------------------------------
# The mysql service's own healthcheck (docker-compose's depends_on condition)
# already gates container startup on MySQL accepting connections, but retry
# a few times anyway in case of a slow first-boot initialization.
echo "[entrypoint] Running migrations..."
for attempt in $(seq 1 10); do
    if php "$APP_DIR/artisan" migrate --force; then
        break
    fi
    echo "[entrypoint] Migration attempt $attempt failed, retrying in 3s..."
    sleep 3
    if [ "$attempt" = 10 ]; then
        echo "[entrypoint] Migrations failed after repeated attempts — aborting." >&2
        exit 1
    fi
done

if [ "${SEED_ON_BOOT:-false}" = "true" ]; then
    echo "[entrypoint] SEED_ON_BOOT=true — running database seeders."
    php "$APP_DIR/artisan" db:seed --force
fi

if [ "${APP_ENV:-production}" = "production" ]; then
    echo "[entrypoint] Caching config/routes/views for production."
    php "$APP_DIR/artisan" config:cache
    php "$APP_DIR/artisan" route:cache
    php "$APP_DIR/artisan" view:cache
fi

echo "[entrypoint] Handing off to supervisord."
exec "$@"
