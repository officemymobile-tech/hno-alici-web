import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/images/insurance");

const logos = [
  ["oegk.svg", "https://upload.wikimedia.org/wikipedia/commons/1/1f/%C3%96GK-Logo.svg"],
  ["svs.png", "https://www.svs.at/cdscontent/load?contentid=10008.724149&version=1570630101"],
  ["bvaeb.png", "https://www.bvaeb.at/cdscontent/load?contentid=10008.723686&version=1570182342"],
  ["kfa.png", "https://www.kfawien.at/cdscontent/load?contentid=10008.673457&version=1549268977"],
];

fs.mkdirSync(outDir, { recursive: true });

for (const [filename, url] of logos) {
  const dest = path.join(outDir, filename);
  const res = await fetch(url, {
    headers: { "User-Agent": "hno-alici-website/1.0 (logo migration)" },
  });
  if (!res.ok) {
    console.error("FAIL", filename, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log("ok", filename, buf.length, res.headers.get("content-type"));
}
