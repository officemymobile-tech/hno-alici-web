import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const root = path.dirname(fileURLToPath(import.meta.url));
const base = path.join(root, "..");

for (const page of ["impressum", "datenschutz"]) {
  const html = fs.readFileSync(path.join(base, `tmp-${page}.html`), "utf8");
  const $ = cheerio.load(html);
  const blocks = [];
  $(".et_pb_text_inner").each((_, el) => {
    const html = $(el).html();
    if (html && html.trim().length > 50) blocks.push(html.trim());
  });
  fs.writeFileSync(
    path.join(base, "src/content", `${page}.json`),
    JSON.stringify({ blocks }, null, 2),
    "utf8",
  );
  console.log(page, blocks.length, "blocks");
}
