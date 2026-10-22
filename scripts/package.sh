#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
bash scripts/check.sh
mkdir -p dist
out="dist/fakk-al-takhbees-chrome.zip"
rm -f "$out"
zip -r "$out" manifest.json popup.html popup.css popup.js converter.js service-worker.js README.md LICENSE -x '*.DS_Store' >/dev/null
echo "Created: $out"
