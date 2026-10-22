#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
fail=0
for tool in node python3; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "ERROR: required tool not found: $tool" >&2
    exit 1
  fi
done
echo "[1/3] Checking manifest JSON..."
python3 -m json.tool manifest.json >/dev/null || fail=1
echo "[2/3] Checking JavaScript syntax..."
for file in converter.js popup.js service-worker.js; do
  if node --check "$file"; then echo "  OK $file"; else fail=1; fi
done
echo "[3/3] Checking manifest files..."
python3 - <<'PY' || fail=1
import json, pathlib, sys
root=pathlib.Path(".")
m=json.loads((root/"manifest.json").read_text(encoding="utf-8"))
files=["popup.html","popup.css","popup.js","converter.js","service-worker.js"]
missing=[f for f in files if not (root/f).is_file()]
if m.get("manifest_version") != 3: missing.append("manifest_version must be 3")
if missing:
    print("ERROR:", ", ".join(missing)); sys.exit(1)
print("  OK required extension files exist")
PY
if (( fail )); then echo "Checks failed." >&2; exit 1; fi
echo "All static checks passed. This does not replace testing in Chrome."
