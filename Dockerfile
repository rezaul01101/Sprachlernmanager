# syntax=docker/dockerfile:1

FROM composer:2 AS composer_bin

FROM php:8.4-fpm-bookworm AS base

# --- System packages --------------------------------------------------------
# default-mysql-client (Debian's own package, MariaDB-based but wire-compatible)
# gives us mysql/mysqladmin/mysqldump for migrations and backups against the
# separate `mysql` service — no need for Oracle's own client package here.
RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        git \
        unzip \
        default-mysql-client \
        libzip-dev \
        libpng-dev \
        libjpeg-dev \
        libonig-dev \
        libxml2-dev \
        libicu-dev \
        curl \
        ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer_bin /usr/bin/composer /usr/bin/composer

COPY docker/php/php-overrides.ini /usr/local/etc/php/conf.d/zz-app-overrides.ini
COPY docker/nginx/site.conf /etc/nginx/sites-available/default
COPY docker/supervisor/supervisord-development.conf /etc/supervisor/conf.d/supervisord-development.conf
COPY docker/supervisor/supervisord-production.conf /etc/supervisor/conf.d/supervisord-production.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/mysql/backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/backup.sh \
    && rm -f /etc/nginx/sites-enabled/default \
    && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default \
    && mkdir -p /var/log/supervisor /var/backups/mysql

WORKDIR /var/www/html
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# =============================================================================
# Development target: source code is bind-mounted in by docker-compose, not
# copied here. Live Vite HMR runs inside the container too.
# =============================================================================
FROM base AS development

COPY docker/php/opcache-development.ini /usr/local/etc/php/conf.d/zz-opcache.ini
RUN rm -f /etc/supervisor/conf.d/supervisord-production.conf \
    && mv /etc/supervisor/conf.d/supervisord-development.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# =============================================================================
# Build stage: installs PHP deps, then builds frontend assets (client + SSR).
# Wayfinder's Vite plugin introspects real Laravel routes while building, so
# it needs a bootable app — .env.example stands in for that at build time
# only; the real .env is bind-mounted at runtime and takes over.
# =============================================================================
FROM base AS build

COPY . .
RUN composer install --no-dev --optimize-autoloader \
    && cp .env.example .env \
    && php artisan key:generate --force \
    && npm ci \
    && npm run build \
    && npm run build:ssr \
    && rm .env

# =============================================================================
# Production target: everything baked into the image. No source bind mount —
# only storage/ (uploads, logs) is bind-mounted. MySQL's own data safety is
# handled entirely by the separate mysql service's bind mount.
# =============================================================================
FROM base AS production

COPY --from=build /var/www/html /var/www/html
# The SSR bundle externalizes @inertiajs/react (and its own deps) rather than
# bundling them — Vite's default for a Node SSR target — so node_modules must
# stay present at runtime for `artisan inertia:start-ssr` to work. Pruning to
# production-only deps keeps the image reasonably sized without breaking that.
RUN npm prune --omit=dev \
    && chown -R www-data:www-data /var/www/html \
    && rm -f /etc/supervisor/conf.d/supervisord-development.conf \
    && mv /etc/supervisor/conf.d/supervisord-production.conf /etc/supervisor/conf.d/supervisord.conf

COPY docker/php/opcache-production.ini /usr/local/etc/php/conf.d/zz-opcache.ini

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
