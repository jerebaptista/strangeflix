import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "content/books/_soi.html");
const outPath = path.join(root, "content/books/the-shadow-over-innsmouth.txt");

const html = fs.readFileSync(htmlPath, "utf8");
const start = html.indexOf("<br /><center>I.</center>");
const end = html.indexOf("for ever.<br />");
if (start < 0 || end < 0) throw new Error("Could not find story bounds");
let chunk = html.slice(start, end + "for ever.<br />".length);

chunk = chunk.replace(/<img[^>]*>/gi, "");
chunk = chunk.replace(/<br\s*\/?>/gi, "\n");
chunk = chunk.replace(/<[^>]+>/g, "");

const entities = {
  "&ndash;": "–",
  "&mdash;": "—",
  "&ldquo;": "\u201c",
  "&rdquo;": "\u201d",
  "&lsquo;": "\u2018",
  "&rsquo;": "\u2019",
  "&ouml;": "ö",
  "&euml;": "ë",
  "&iuml;": "ï",
  "&agrave;": "à",
  "&egrave;": "è",
  "&oacute;": "ó",
  "&uuml;": "ü",
  "&ccedil;": "ç",
  "&hellip;": "…",
  "&nbsp;": " ",
  "&bull;": "•",
  "&copy;": "©",
};
for (const [k, v] of Object.entries(entities)) {
  chunk = chunk.split(k).join(v);
}
chunk = chunk.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
chunk = chunk.replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
  String.fromCharCode(parseInt(h, 16))
);

const lines = chunk
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);
const title = "The Shadow over Innsmouth\nBy H. P. Lovecraft\n\n";
const body = lines.join("\n\n     ");
fs.writeFileSync(outPath, title + body + "\n", "utf8");
console.log("Wrote", outPath, body.length, "chars");
