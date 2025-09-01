import io, base64, json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form
import fitz  # PyMuPDF
from presidio_analyzer import AnalyzerEngine, RecognizerRegistry
from presidio_anonymizer import AnonymizerEngine
import spacy

app = FastAPI(title="Ingestion/Clinical NLP")

# Load small SciSpacy model (no external keys)
nlp = spacy.load("en_core_sci_sm")

# PHI/PII redaction
registry = RecognizerRegistry()
analyzer = AnalyzerEngine(registry=registry)
anonymizer = AnonymizerEngine()

def pdf_to_text(pdf_bytes: bytes) -> List[dict]:
    """Extract per-page text + bbox via PyMuPDF."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    for i, page in enumerate(doc):
        text = page.get_text("text")
        pages.append({"page": i+1, "text": text})
    return pages

@app.post("/ingest")
async def ingest(file: UploadFile = File(...),
                 ocr: Optional[bool] = Form(False),
                 redact: Optional[bool] = Form(True)):
    pdf_bytes = await file.read()
    pages = pdf_to_text(pdf_bytes)

    full_text = "\n\n".join([f"[p{p['page']}] {p['text']}" for p in pages])

    # Basic de-id (toggle)
    redacted_text = full_text
    if redact:
        results = analyzer.analyze(text=full_text, language="en")
        redacted_text = anonymizer.anonymize(text=full_text, analyzer_results=results).text

    # Clinical entities (simple)
    doc = nlp(redacted_text)
    ents = [{"text": e.text, "label": e.label_} for e in doc.ents if e.text.strip()]

    return {
        "pages": pages,                # raw page text
        "text_redacted": redacted_text,
        "entities": ents               # clinical-ish entities
    }
