#!/bin/sh
set -eu

echo "[start] woa-api cwd=$(pwd) PORT=${PORT:-unset} HOST=${HOST:-0.0.0.0}"

npx prisma migrate deploy
echo "[start] migrations complete; seeding catalogue data (node prisma/seed.cjs)"
node prisma/seed.cjs
echo "[start] seed complete; launching node"

exec node dist/main.js
