# bedrock-admin (VAClaims)

Admin service for uploading VA claim PDFs, extracting text (OCR), analyzing decision letters,
and generating rebuttal PDFs.

## Quick commands
- Health: `curl -fsS http://127.0.0.1:8082/admin/healthz`
- Compare: `POST /admin/compare-decision`
- Rebuttal: `POST /admin/rebut-cue`
