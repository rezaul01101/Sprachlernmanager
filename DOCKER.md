# Docker

Two independent compose files, no shared base file:

- `compose.dev.yml` — full local stack: nginx, php-fpm, mysql, redis, and a
  node container running the Vite dev server. Source is bind-mounted; edits
  on the host show up immediately.
- `compose.prod.yml` — nginx + php-fpm with the code baked into the image
  (no bind mount), plus redis. No local mysql — `app` joins the external
  `appnet` network to reach the shared MySQL container (`mysql`) used by
  other stacks on the host.

Both build the same `docker/php/Dockerfile`, using a different `target` per
service — `dev` (dev's `app` and `node` services), `app` (prod php-fpm),
`nginx` (prod nginx, built assets baked in).

## Dev

```bash
cp .env.example .env
```

Then set, at minimum:

```
APP_URL=http://localhost:5001
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=german_word_manager
DB_USERNAME=sprachbahnhof
DB_PASSWORD=secret
REDIS_HOST=redis
```

> `DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD` above must match `compose.dev.yml`'s
> `mysql` service exactly — change both places together if you rename them.

```bash
docker compose -f compose.dev.yml up -d --build
docker compose -f compose.dev.yml exec app composer install
docker compose -f compose.dev.yml exec app php artisan migrate
```

- App: http://localhost:5001
- Vite dev server (HMR): http://localhost:5173
- MySQL exposed on host port 3307 (for TablePlus/Sequel Ace etc.)

## Production

The `appnet` network (and the shared `mysql` container on it) must already
exist on the host before starting this stack — it's created by the other
stack, not by `compose.prod.yml`.

```bash
cp .env.example .env
```

Set, at minimum:

```
APP_URL=http://<server-address>:5001
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=<this app's database>
DB_USERNAME=<this app's db user>
DB_PASSWORD=<real password>
REDIS_HOST=redis
```

```bash
docker compose -f compose.prod.yml up -d --build
docker compose -f compose.prod.yml exec app php artisan migrate --force
```

- App: http://<server-address>:5001
- No source bind mount — redeploy by rebuilding the image (`up -d --build`)
  after pulling new code.
- Uploaded files: `storage_public` is a named volume mounted at
  `storage/app/public` in `app` and `public/storage` in `nginx` — the two
  containers share it directly, so there's no `php artisan storage:link`
  step (no single container has both paths to symlink between).
