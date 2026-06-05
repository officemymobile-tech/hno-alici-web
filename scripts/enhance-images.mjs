/**
 * KI-Bildverbesserung: Referenzfotos aus public/images/original/
 * werden als Basis für manuelle Regenerierung in Cursor (GenerateImage) genutzt.
 * Ausgabe: public/images/pro/*-pro.jpg
 *
 * Dieses Script kopiert fertige Pro-Assets aus dem Cursor-Assets-Ordner
 * oder listet fehlende Dateien auf.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const proDir = path.join(root, "public/images/pro");
const assetsDir = path.join(
  process.env.CURSOR_ASSETS_DIR ??
    path.join(process.env.USERPROFILE ?? "", ".cursor/projects/c-Users-Kassa-drdemirel-website/assets"),
);

const proFiles = [
  "dr-alici-portrait-pro.jpg",
  "ordination-hero-pro.jpg",
  "leistungen-foto-09-pro.jpg",
  "leistungen-foto-10-pro.jpg",
  "leistungen-overview-pro.jpg",
  "team-fr-alici-pro.jpg",
];

fs.mkdirSync(proDir, { recursive: true });

let copied = 0;
for (const file of proFiles) {
  const src = path.join(assetsDir, file);
  const dest = path.join(proDir, file);
  if (!fs.existsSync(src)) {
    console.warn("fehlt in assets:", file);
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log("ok", file);
  copied++;
}

console.log(`\n${copied}/${proFiles.length} Pro-Fotos in public/images/pro/`);
