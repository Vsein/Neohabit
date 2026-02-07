#!/bin/sh
set -e

envsubst \
  < /usr/share/nginx/html/runtime-config.template.js \
  > /usr/share/nginx/html/runtime-config.js

export DOMAIN="${DOMAIN:-localhost}"
export BACKEND_HOST="${BACKEND_HOST:-backend}"
export BACKEND_PORT="${BACKEND_PORT:-9000}"

envsubst '$DOMAIN $BACKEND_HOST $BACKEND_PORT' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec "$@"
