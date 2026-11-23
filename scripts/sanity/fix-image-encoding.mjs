// Performance fix: 5 of the 7 "pro" photo assets are PNG files saved with a
// .jpg extension (confirmed via `sharp(...).metadata().format`) — ~1.8-2.1MB
// each for a photographic image, because PNG's lossless compression is a poor
// fit for photos. Re-encodes them as genuine JPEGs at the same pixel
// dimensions (no crop, no resize, no content change) — a pure format/codec
// fix, not a re-edit of what's depicted. Originals are not touched (this
// writes a sibling file, swapped in only after a size/visual sanity check).
import sharp from "sharp";
import fs from "fs";

const files = [
  "ordination-hero-pro.jpg",
  "leistungen-foto-09-pro.jpg",
  "leistungen-foto-10-pro.jpg",
  "leistungen-overview-pro.jpg",
  "team-fr-alici-pro.jpg",
];

const dir = "public/images/pro";

for (const file of files) {
  const src = `${dir}/${file}`;
  const before = fs.statSync(src).size;
  const buf = await sharp(src).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  const tmp = `${src}.tmp`;
  fs.writeFileSync(tmp, buf);
  const after = fs.statSync(tmp).size;
  fs.renameSync(tmp, src);
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
}
