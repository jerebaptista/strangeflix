import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GUTENBERG_TXT =
  "https://www.gutenberg.org/cache/epub/70652/pg70652.txt";

async function loadSource() {
  const dump = process.env.MOUNTAINS_DUMP;
  if (dump && fs.existsSync(dump)) {
    return fs.readFileSync(dump, "utf8");
  }
  const res = await fetch(GUTENBERG_TXT, {
    headers: { "User-Agent": "Strangeflix/1.0 (public-domain text)" },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${GUTENBERG_TXT}`);
  return res.text();
}

/** Gutenberg wraps lines at ~70 chars; blank line = paragraph. Merge within paragraphs. */
function reflowBody(raw) {
  const blocks = raw.split(/\n\s*\n/);
  const out = [];
  for (const block of blocks) {
    const t = block.replace(/\r/g, "").trim();
    if (!t) continue;
    if (/^\*{3}\s/.test(t)) continue;
    if (/^\[Transcriber/i.test(t)) continue;
    if (/^At the MOUNTAINS of MADNESS$/i.test(t)) continue;
    if (/^By H\. P\. LOVECRAFT$/i.test(t)) continue;
    const merged = t.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    if (merged) out.push(merged);
  }
  return out.join("\n\n");
}

async function main() {
  const s = await loadSource();
  const start =
    s.indexOf("*** START OF THE PROJECT GUTENBERG EBOOK AT THE MOUNTAINS OF MADNESS ***") +
    "*** START OF THE PROJECT GUTENBERG EBOOK AT THE MOUNTAINS OF MADNESS ***".length;
  const end = s.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK AT THE MOUNTAINS OF MADNESS ***");
  if (start < 100 || end < start) {
    throw new Error("Could not find Gutenberg START/END markers");
  }
  let body = s.slice(start, end).replace(/\r\n/g, "\n").trim();
  // Drop title/transcriber block so first paragraph is "I am forced..."
  const first = body.indexOf("I am forced into speech");
  if (first > 0) body = body.slice(first);
  const text = reflowBody(body).trim() + "\n";
  const dest = path.join(__dirname, "../content/books/at-the-mountains-of-madness.txt");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text, "utf8");
  console.log("Wrote", dest, fs.statSync(dest).size, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
