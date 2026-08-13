#!/usr/bin/env bash
set -e

# Start nginx in background
nginx -g "daemon off;" &
NGINX_PID=$!

# Start node proxy in background
# Ensure NODE_ENV or other env vars are available via docker run -e
node /app/server.js &
NODE_PID=$!

# Trap signals and forward to children
_term() {
  echo "Shutting down..."
  kill -TERM "$NODE_PID" 2>/dev/null
  kill -TERM "$NGINX_PID" 2>/dev/null
  wait "$NODE_PID"
  wait "$NGINX_PID"
  exit 0
}
trap _term SIGTERM SIGINT

# Wait for both processes
wait -n
# If one exits, shut down the other
_term
