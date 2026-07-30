#!/usr/bin/env bash
set -euo pipefail

# Directory to deploy the release into, e.g. /data01/.../htdocs/liides
DEPLOY_DIR="${1:?Usage: $0 <deploy-directory>}"

# The release archive is uploaded alongside this script, so use this
# script's own location as the staging directory.
STAGING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TMP_DIR="$(mktemp -d)"

cp -a "$DEPLOY_DIR/.env" "$TMP_DIR/"
cp -a "$DEPLOY_DIR/storage" "$TMP_DIR/"

rm -rf "${DEPLOY_DIR:?}"/*

mv "$TMP_DIR/.env" "$DEPLOY_DIR/"
mv "$TMP_DIR/storage" "$DEPLOY_DIR/"
rmdir "$TMP_DIR"

RELEASE_TAR="$(find "$STAGING_DIR" -maxdepth 1 -name '*.tar.gz' -print -quit)"
if [[ -z "$RELEASE_TAR" ]]; then
  echo "No release archive (*.tar.gz) found in $STAGING_DIR" >&2
  exit 1
fi

cp "$RELEASE_TAR" "$DEPLOY_DIR/"
DEPLOY_TAR="$DEPLOY_DIR/$(basename "$RELEASE_TAR")"

tar -xzf "$DEPLOY_TAR" -C "$DEPLOY_DIR"
rm "$DEPLOY_TAR"

cd "$DEPLOY_DIR"

composer update
composer install --no-dev
php artisan migrate --force

echo "✅ Deployed $(basename "$RELEASE_TAR" .tar.gz) successfully"
