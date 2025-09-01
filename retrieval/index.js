import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/** 
 * We shell to a tiny Python script using sentence-transformers + faiss as a fallback
 * if you don’t want to use Bedrock for embeddings during indexing.
 */
export async function buildIndex(pages, outdir=".faiss") {
  fs.mkdirSync(outdir, { recursive: true });
  const dataPath = path.join(outdir, "docs.jsonl");
  fs.writeFileSync(dataPath, pages.map(p => JSON.stringify(p)).join("\n"));
  await runPy(["retrieval_py.py", "build", dataPath, outdir]);
}

export async function search(query, outdir=".faiss", k=5) {
  const res = await runPy(["retrieval_py.py", "search", query, outdir, String(k)]);
  return JSON.parse(res);
}

function runPy(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("python3", [path.join(__dirname, "retrieval_py.py"), ...args.slice(1)], { cwd: __dirname });
    let out="", err="";
    p.stdout.on("data", d => out += d.toString());
    p.stderr.on("data", d => err += d.toString());
    p.on("close", code => code===0 ? resolve(out.trim()) : reject(new Error(err || `py exit ${code}`)));
  });
}
