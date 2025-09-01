#!/usr/bin/env bash
set -euo pipefail
echo "SMOKE: starting py worker..."
( cd ingestion/py && ./start.sh ) &
PY_PID=$!
sleep 10
echo "SMOKE: calling Node..."
node -e 'import("./server/index.js")'
# give it a sec to boot
sleep 3
# requires a sample.pdf (add your own), skip if absent
if [ -f sample.pdf ]; then
  curl -s -X POST http://localhost:3000/analyze \
    -H "Content-Type: application/json" \
    -d '{"pdfPath":"sample.pdf","question":"Summarize claimed conditions and dates."}' | tee /dev/stderr
fi
kill $PY_PID || true
