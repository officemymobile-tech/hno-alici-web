import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/images");

const images = [
  ["logo.png", "https://hno-alici.at/wp-content/uploads/2019/11/Logo_Dr_Alici_01.png"],
  ["logo-icon.png", "https://hno-alici.at/wp-content/uploads/2019/11/Logo_Dr_Alici_01-150x150.png"],
  ["logo-dr-umit.png", "https://hno-alici.at/wp-content/uploads/2019/11/logo_dr_umit_832-300x107-300x107.png"],
  ["icon-allgemeine-hno.png", "https://hno-alici.at/wp-content/uploads/2019/11/Allgemein-HNO-Dunkel-Blau.png"],
  ["icon-kinder-hno.png", "https://hno-alici.at/wp-content/uploads/2019/11/Kinder-HNO.png"],
  ["icon-allergie.png", "https://hno-alici.at/wp-content/uploads/2019/11/nose-2.png"],
  ["icon-health.png", "https://hno-alici.at/wp-content/uploads/2019/11/health-icon-14-3.png"],
  ["ordination-hero.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO-Alici-Ordination-01-3000x1478-1-scaled.jpg"],
  ["ordination-banner.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO-Alici-Ordination-01-1500x139-1.jpg"],
  ["dr-alici-portrait.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO_Alici_Ordipix_neutral_06_cHR-scaled.jpg"],
  ["leistungen-foto-09.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO-Alici-Fotos-09-945x1094-1.jpg"],
  ["leistungen-foto-10.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO-Alici-Fotos-10-1000x667-1.jpg"],
  ["leistungen-overview.jpg", "https://hno-alici.at/wp-content/uploads/2019/11/HNO-Alici-Leistungen-1010x1111.jpg"],
  ["team-fr-alici.jpg", "https://hno-alici.at/wp-content/uploads/2021/03/HNO-Fr.-Alici-1602x2400-1.jpg"],
  ["google-map.jpg", "https://hno-alici.at/wp-content/uploads/2020/08/Dr.-Alici-Google-Map-Senefeldergasse-3-1-01.jpg"],
];

fs.mkdirSync(outDir, { recursive: true });

for (const [filename, url] of images) {
  const dest = path.join(outDir, filename);
  if (fs.existsSync(dest)) {
    console.log("skip", filename);
    continue;
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.error("FAIL", filename, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log("ok", filename, buf.length);
}
