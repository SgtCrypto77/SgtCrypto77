#!/usr/bin/env bash
set -euo pipefail
# Wait up to 20s for the port to open
for i in {1..20}; do
  if curl -fsS http://127.0.0.1:8082/admin/healthz >/dev/null; then break; fi
  sleep 1
done
# Run the real smoke, but never fail the unit
/opt/bedrock-admin/bin/smoke.sh || echo "poststart smoke failed (non-fatal)"
exit 0
