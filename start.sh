#!/usr/bin/env bash
# Serve the static Conserto 3D build in the foreground and publish deployment metadata.
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

PORT="${PORT:-3000}"
export PORT
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
BUILD_DIR="$PROJECT_ROOT"

/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_ROOT" "$BUILD_DIR" > "$WEB_DIR/deployment-output.json"
/usr/bin/time -p test -f "$BUILD_DIR/index.html"

# Static HTML project: no dependencies to install and no build step.
echo "Serving $BUILD_DIR on port $PORT" >&2
exec /usr/bin/time -p node "${RUNTIME_DIR:?RUNTIME_DIR is required}/scripts/default-start.mjs"
