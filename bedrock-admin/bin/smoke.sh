#!/usr/bin/env bash
set -euo pipefail
bail(){ echo "!! $*"; exit 1; }

curl -fsS http://127.0.0.1:8082/admin/healthz | jq -e ".ok==true" >/dev/null || bail "healthz failed"

curl -fsS -H "Content-Type: application/json" --data-binary '{
  "decision_files":["ClaimLetter-2025-06-24.pdf"],
  "files":["ENTIRE CUE PKT Compressed.pdf"], "options":{"ocr":false}
}' http://127.0.0.1:8082/admin/compare-decision | jq -e ".ok==true and .analysis!=null" >/dev/null || bail "compare-decision failed"

curl -fsS -H "Content-Type: application/json" --data-binary '{
  "claimant":{"name":"Kim T."},
  "decision_files":["ClaimLetter-2025-06-24.pdf","ClaimLetter-2008-4-30.pdf"],
  "files":["ENTIRE CUE PKT Compressed.pdf"], "options":{"ocr":true}
}' http://127.0.0.1:8082/admin/rebut-cue | jq -e ".ok==true and (.rebuttal_pdf.url // .pdf | length)>0" >/dev/null || bail "rebut-cue failed"

echo "smoke: OK"
