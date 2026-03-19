import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "../content/books/the-shadow-out-of-time.txt");
let raw = fs.readFileSync(p, "utf8");
const header = raw.match(/^The Shadow out of Time\nBy H\. P\. Lovecraft\n\n/)[0];
let body = raw.slice(header.length);

const blocks = body.split(/\n\n     /).map((b) => b.replace(/\s+/g, " ").trim());
const out = [];
let cur = "";

function endsSentence(s) {
  return /[.!?…]["']?\s*$/.test(s.trimEnd());
}

for (const b of blocks) {
  if (/^(I{1,3}|IV|V|VI|VII|VIII|IX)\.$/.test(b)) {
    if (cur) {
      out.push(cur);
      cur = "";
    }
    out.push("__SECTION__" + b);
    continue;
  }
  if (!cur) {
    cur = b;
    continue;
  }
  if (!endsSentence(cur) || /^[a-z(—"']/.test(b)) {
    cur += " " + b;
  } else {
    out.push(cur);
    cur = b;
  }
}
if (cur) out.push(cur);

const text = out
  .map((para) => {
    if (para.startsWith("__SECTION__")) return para.replace("__SECTION__", "") + "\n";
    return "     " + para;
  })
  .join("\n\n");

fs.writeFileSync(p, header + text + "\n", "utf8");
console.log("Merged paragraphs, lines:", text.split("\n").length);
