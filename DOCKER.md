# Docker

Two services: `app` (Nginx + PHP-FPM + Node, all supervised by `supervisord`) and
`mysql` (the official `mysql:8.4` image). One `Dockerfile` with `development`
and `production` build targets; three Compose files layer dev/prod behaviour
on a shared base.

## Data safety

MySQL's data directory is **bind-mounted**, not a named volume:

```yaml
volumes:
  - ./docker/data/mysql:/var/lib/mysql
```

That means the real InnoDB/binlog files live at `docker/data/mysql/` on the
host filesystem. `docker compose down`, an image rebuild, or `docker rm` never
touch it — only deleting that folder does. This was verified end-to-end
(record created → full `docker compose down` removing containers and the
network → fresh `up` → record still there).

`storage/` (uploads, logs) is bind-mounted the same way in production —
`docker/data/storage/`.

A `mysql-backup` supervised process (production only) runs `mysqldump` daily
against the `mysql` service, gzips it to `docker/data/mysql-backups/`, and
keeps the last 7. Verified restorable (`gunzip -t` + reimport + row-count
check), not just "a file exists".

Both `docker/data/` and `.env.docker` are gitignored — never commit real
credentials or the raw data directory.

## First-time setup

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` and set real values for `DB_PASSWORD`, `MYSQL_PASSWORD`
(same value — see the comment in the file for why there are two keys),
`MYSQL_ROOT_PASSWORD`, and `APP_KEY` (dev auto-generates one on first boot;
production refuses to start without one already set — run
`php artisan key:generate --show` locally and paste it in).

This file is separate from the plain `.env` used by a host-based (e.g. Herd)
dev setup, specifically so the two never collide — different DB credentials,
different ports, no shared MySQL instance. `.env.docker` gets bind-mounted as
`/var/www/html/.env` inside the container either way.

**Ports**: defaults are `8090` (app), `5183` (Vite dev), `3317` (MySQL,
dev-only). These were deliberately picked to avoid the common `8080`/`5173`/
`3306`/`3307` defaults, which collide with this machine's other running
Laravel project (`laravel_app`/`laravel_mysql`/etc). Check `docker ps` for
conflicts before changing them, and note these host-port fallbacks live in
`docker-compose.yml`/`docker-compose.override.yml` themselves, not
`.env.docker` — Compose reads `.env.docker`'s values into containers via
`env_file:`, but doesn't use it for the compose file's own `${VAR}`
substitution (no `--env-file` flag is used, by design, so `.env.docker` never
needs to be named plain `.env` and risk colliding with a host `.env`).

## Development

```bash
docker compose up -d --build
```

`docker-compose.override.yml` loads automatically. What you get:
- The whole repo bind-mounted into the container — edit on the host, see it
  live.
- `node_modules` is a **named volume**, not part of that bind mount — npm
  packages here include native binaries (Rolldown/Vite) built for Linux, and
  would break if shadowed by a macOS-built host copy. Same reasoning for a
  fresh `vendor/`: the entrypoint runs `composer install`/`npm install`
  automatically if either is missing/empty on first boot.
- Vite's dev server runs *inside* the container (`npx vite --host 0.0.0.0`,
  not the Herd-aware `vp dev` wrapper, which assumes Herd's TLS is available
  on the host) — HMR at `http://localhost:5183`.
- MySQL's port is exposed to the host (`3317` by default) for GUI clients
  (TablePlus, Sequel Ace, etc).
- Migrations run automatically on every container start (idempotent —
  `Nothing to migrate` after the first run).

App: `http://localhost:8090`

## Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Differences from dev:
- `production` build target — client assets and the Inertia SSR bundle are
  built at image-build time (`npm run build && npm run build:ssr`), baked
  into the image. No source bind mount; only `.env.docker` and `storage/` are
  bind-mounted.
- `node_modules` is pruned to production dependencies only (`npm prune
  --omit=dev`) rather than removed entirely — the SSR bundle externalizes
  `@inertiajs/react` (Vite's default for a Node SSR target) instead of
  bundling it, so it's genuinely needed at runtime, just not the build-time
  devDependencies.
- Config/routes/views are cached on boot.
- `inertia:start-ssr` and the `mysql-backup` cron-style process run as
  additional supervised programs.
- MySQL's port is **not** exposed to the host.
- Missing `APP_KEY` is a hard failure, not an auto-generate — a container
  silently minting its own encryption key would break every other instance's
  encrypted sessions/cookies behind a load balancer.

For an actual remote server, `.env.docker` there holds that server's own
production secrets — same relative filename, different (never-committed)
content per machine, standard practice.

## Common commands

```bash
docker compose logs -f app                 # tail app logs (all supervised processes)
docker compose exec app bash               # shell into the app container
docker compose exec app php artisan tinker # tinker against the containerized DB
docker compose down                        # stop + remove containers (data survives — see above)
```

Restoring a backup:
```bash
docker compose exec app sh -c 'zcat /var/backups/mysql/<file>.sql.gz' \
  | docker compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <database>
```

## Why MySQL is a separate service, not inside the app container

The `mysql` service uses Oracle's official multi-arch `mysql:8.4` Docker Hub
image. An earlier iteration tried installing `mysql-server` via apt directly
into the app image (matching a literal reading of "same container") — that
hit two real, unrelated walls: Oracle's raw APT repo signing key was expired
server-side, and — more fundamentally — **Oracle's APT repo has no `arm64`
build at all**, only `amd64`. The official Docker Hub image doesn't have
either problem (multi-arch, no APT trust issues), which is why MySQL runs as
its own service on a shared `laravel` Docker network instead.
