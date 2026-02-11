#!/bin/sh
set -e

sed \
 's|$DISABLE_SIGNUP|'${DISABLE_SIGNUP}'|g; \
  s|$STRICT_USER_FIELDS|'${STRICT_USER_FIELDS}'|g; \
  s|$REQUIRE_EMAIL|'${REQUIRE_EMAIL}'|g; \
  s|$DEMO|'${DEMO}'|g' \
 /srv/runtime-config.template.js > /srv/runtime-config.js

exec "$@"
