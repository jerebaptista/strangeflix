import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIKISOURCE_PAGE =
  "http://en.wikisource.org/wiki/Weird_Tales/Volume_13/Issue_4/The_Dunwich_Horror";

async function loadSource() {
  const dump = process.env.WIKISOURCE_DUMP;
  if (dump && fs.existsSync(dump)) {
    return fs.readFileSync(dump, "utf8");
  }
  const u = `https://r.jina.ai/${WIKISOURCE_PAGE}`;
  const res = await fetch(u, { headers: { "User-Agent": "Strangeflix/1.0 (public-domain text)" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${u}`);
  return res.text();
}

function cleanLine(line) {
  return line
    .replace(/\u200b/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

async function main() {
  const s = await loadSource();
  const lines = s.split(/\r?\n/);
  const out = [];
  let on = false;
  for (const raw of lines) {
    const t = cleanLine(raw);
    if (t.startsWith("Retrieved from")) break;
    if (t.includes("Gorgons, and Hydras") && t.includes("Charles Lamb")) on = true;
    if (!on) continue;
    if (/^(Search|Public domain|This work is in the)/i.test(t)) continue;
    if (t === "|" || t.startsWith("|")) continue;
    if (/^\d+$/.test(t)) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    if (!t) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    out.push(t);
  }
  const dest = path.join(__dirname, "../content/books/the-dunwich-horror.txt");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const text = out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  fs.writeFileSync(dest, text, "utf8");
  console.log("Wrote", dest, fs.statSync(dest).size, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
