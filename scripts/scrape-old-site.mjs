import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const files = [
  "tmp-home",
  "tmp-leistungen",
  "tmp-team",
  "tmp-kontakt",
  "tmp-impressum",
  "tmp-datenschutz",
];

for (const f of files) {
  const html = fs.readFileSync(path.join(root, `${f}.html`), "utf8");
  const $ = cheerio.load(html);
  console.log(`\n=== ${f} ===`);
  console.log("TITLE:", $("title").text().trim());

  const imgs = new Set();
  $("img").each((_, el) => {
    const s = $(el).attr("src");
    if (s) imgs.add(s);
  });
  $("[style*='background-image']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const m = style.match(/url\(([^)]+)\)/);
    if (m) imgs.add(m[1].replace(/['"]/g, ""));
  });
  for (const img of imgs) console.log("IMG:", img);

  $(".et_pb_text_inner").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t.length > 15) console.log("TEXT:", t.slice(0, 500));
  });

  $(".et_pb_team_member_description").each((_, el) => {
    const name = $(el).closest(".et_pb_team_member").find("h4").text().trim();
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t) console.log("TEAM:", name, "->", t.slice(0, 300));
  });

  $(".et_pb_blurb_container h4").each((_, el) => {
    const title = $(el).text().trim();
    const desc = $(el).closest(".et_pb_blurb").find(".et_pb_blurb_description").text().replace(/\s+/g, " ").trim();
    if (title) console.log("BLURB:", title, desc ? "-> " + desc.slice(0, 200) : "");
  });
}
