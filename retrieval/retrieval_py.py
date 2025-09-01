import sys, json, os
from typing import List
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np

MODEL = SentenceTransformer("all-MiniLM-L6-v2")

def load_pages(jsonl_path: str):
    pages=[]
    with open(jsonl_path, "r") as f:
        for line in f:
            pages.append(json.loads(line))
    return pages

def build(jsonl_path: str, outdir: str):
    pages = load_pages(jsonl_path)
    texts = [f"[p{p['page']}] {p['text']}" for p in pages]
    embs = MODEL.encode(texts, convert_to_numpy=True, show_progress_bar=False).astype("float32")
    index = faiss.IndexFlatIP(embs.shape[1])
    faiss.normalize_L2(embs)
    index.add(embs)
    faiss.write_index(index, os.path.join(outdir, "index.faiss"))
    with open(os.path.join(outdir, "meta.json"), "w") as f:
        json.dump({"texts": texts}, f)
    print(json.dumps({"ok": True, "count": len(texts)}))

def search(query: str, outdir: str, k: int=5):
    index = faiss.read_index(os.path.join(outdir, "index.faiss"))
    meta = json.load(open(os.path.join(outdir, "meta.json")))
    q = MODEL.encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(q)
    D, I = index.search(q, k)
    hits=[]
    for score, idx in zip(D[0].tolist(), I[0].tolist()):
        hits.append({"score": float(score), "text": meta["texts"][idx]})
    print(json.dumps(hits))

if __name__=="__main__":
    # args: [build/search] ...
    mode = sys.argv[1]
    if mode=="build":
        build(sys.argv[2], sys.argv[3])
    elif mode=="search":
        search(sys.argv[2], sys.argv[3], int(sys.argv[4]))
