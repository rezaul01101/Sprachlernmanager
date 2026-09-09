#!/usr/bin/env bash
set -euo pipefail

# Runs as a long-lived supervised process inside the app container: sleeps,
# dumps the separate `mysql` service over the network, repeats. Keeps the
# last 7 daily dumps so a bad migration or accidental DROP TABLE is
# recoverable without reaching for the raw data directory.

BACKUP_DIR=/var/backups/mysql
DB_HOST="${DB_HOST:-mysql}"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"
mkdir -p /var/log/mysql

while true; do
    if mysqladmin ping -h"$DB_HOST" -u"${DB_USERNAME:?}" -p"${DB_PASSWORD:?}" --silent >/dev/null 2>&1; then
        timestamp=$(date +%Y%m%d-%H%M%S)
        dest="$BACKUP_DIR/${DB_DATABASE:-app}-${timestamp}.sql.gz"
        if mysqldump -h"$DB_HOST" -u"${DB_USERNAME:?}" -p"${DB_PASSWORD:?}" \
            --single-transaction --routines --triggers "${DB_DATABASE:?}" 2>/var/log/mysql/backup-error.log \
            | gzip > "$dest"; then
            echo "[backup] Wrote $dest"
            find "$BACKUP_DIR" -name '*.sql.gz' -mtime "+${KEEP_DAYS}" -delete
        else
            echo "[backup] mysqldump failed, see /var/log/mysql/backup-error.log" >&2
        fi
    else
        echo "[backup] mysql service unreachable, will retry on next cycle" >&2
    fi
    sleep 86400
done
