import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

export async function ingestPdf({ filepath, ocr=false, redact=true, endpoint="http://localhost:8081/ingest" }) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filepath));
  form.append("ocr", String(ocr));
  form.append("redact", String(redact));
  const res = await fetch(endpoint, { method: "POST", body: form, headers: form.getHeaders() });
  if (!res.ok) throw new Error(`ingest failed: ${res.status} ${await res.text()}`);
  return res.json();
}
