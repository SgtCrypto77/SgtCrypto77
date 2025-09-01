import express from "express";
import fs from "fs";
import { ingestPdf } from "../ingestion/js/client.js";
import { buildIndex, search } from "../retrieval/index.js";
import { bedrockChat } from "./bedrock.js";

const app = express();
app.use(express.json({ limit: "20mb" }));

app.post("/analyze", async (req, res) => {
  try {
    const { pdfPath, question } = req.body; // pdfPath is a server-local path for demo
    const ing = await ingestPdf({ filepath: pdfPath, ocr: false, redact: true });

    // Build search index from page texts
    await buildIndex(ing.pages);

    // Retrieve top passages for the question
    const hits = await search(question, ".faiss", 5);

    const system = fs.readFileSync("prompts/claims_summary.md", "utf8");
    const context = hits.map(h => h.text).join("\n---\n");
    const user = `Question: ${question}\n\nRelevant excerpts:\n${context}\n\nAnswer with citations like [p#].`;

    const answer = await bedrockChat({ system, user });
    res.json({ answer, evidence: hits, entities: ing.entities });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listening on", port));
