import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(
  process.env.WIKISOURCE_DUMP ||
    "C:/Users/User/.cursor/projects/c-Users-User-Documents-strangeflix/agent-tools/7fc375ca-729a-4cb1-8e50-160b896b389e.txt",
);
if (!fs.existsSync(src)) {
  console.error("Missing dump:", src);
  process.exit(1);
}
const s = fs.readFileSync(src, "utf8");
const lines = s.split(/\r?\n/);
const out = [];
let on = false;
for (const line of lines) {
  const t = line.trim();
  if (t.startsWith('"Of such great powers')) on = true;
  if (t.startsWith("This work is in the")) break;
  if (!on) continue;
  if (t.startsWith("|")) continue;
  if (t === "---") {
    out.push("");
    continue;
  }
  const L = line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  if (!L) continue;
  if (/^(Search|Retrieved from|Public domain)/i.test(L)) continue;
  out.push(L);
}
const dest = path.join(__dirname, "../content/books/the-call-of-cthulhu.txt");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out.join("\n\n"), "utf8");
console.log("Wrote", dest, fs.statSync(dest).size, "bytes");
