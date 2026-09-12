# syntax=docker/dockerfile:1

FROM composer:2 AS composer_bin

# =============================================================================
# Base: PHP-FPM with the extensions this app needs. No web server, no Node —
# those are added by the stages below depending on what each one is for.
# =============================================================================
FROM php:8.4-fpm-bookworm AS base

# default-mysql-client (Debian's own package, MariaDB-based but wire-compatible)
# gives us mysql/mysqladmin for ad-hoc debugging against the `mysql` service.
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer_bin /usr/bin/composer /usr/bin/composer
COPY docker/php/php-overrides.ini /usr/local/etc/php/conf.d/zz-app-overrides.ini

WORKDIR /var/www/html

# =============================================================================
# Dev: adds Node so this one image can run either as the `app` service
# (php-fpm) or the `node` service (`npm run dev`) in compose.dev.yml. Source
# arrives via bind mount, not COPY — nothing app-specific is baked in here.
# =============================================================================
FROM base AS dev

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/php/opcache-development.ini /usr/local/etc/php/conf.d/zz-opcache.ini

# =============================================================================
# Build: installs PHP + JS deps and compiles frontend assets. Feeds both the
# `app` and `nginx` production targets below — neither builds assets itself.
#
# Wayfinder's Vite plugin introspects real Laravel routes while building, so
# it needs a bootable app — .env.example stands in for that at build time
# only; the real .env is supplied at runtime via env_file and never lives
# in the image.
# =============================================================================
FROM dev AS build

COPY . .

RUN composer install --no-dev --optimize-autoloader \
    && cp .env.example .env \
    && php artisan key:generate --force \
    && npm ci \
    && npm run build \
    && rm .env \
    && rm -rf node_modules

# =============================================================================
# App: production PHP-FPM. Code is baked in — no bind mount, no Node. Matches
# compose.prod.yml's `app` service (target: app).
# =============================================================================
FROM base AS app

COPY docker/php/opcache-production.ini /usr/local/etc/php/conf.d/zz-opcache.ini
COPY --from=build /var/www/html /var/www/html

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

# =============================================================================
# Nginx: production web server. Only the built public/ assets are baked in —
# at the same absolute path as the `app` target, so fastcgi_pass's
# SCRIPT_FILENAME resolves to the same file across both containers. Matches
# compose.prod.yml's `nginx` service (target: nginx).
# =============================================================================
FROM nginx:1.27-alpine AS nginx

COPY --from=build /var/www/html/public /var/www/html/public
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
