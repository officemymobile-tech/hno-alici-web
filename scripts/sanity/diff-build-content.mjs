// Compares the *rendered text content* of every page between two build
// outputs, ignoring hashed asset filenames/build IDs that legitimately
// change build-to-build. Used for the Phase 4 before/after migration
// comparison (plan Section 4.1a) and the rollback/fallback tests.
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import * as cheerio from "cheerio";

const [, , dirA, dirB] = process.argv;
if (!dirA || !dirB) {
  console.error("Usage: node diff-build-content.mjs <dirA> <dirB>");
  process.exit(1);
}

function walk(dir, out = [], root = dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out, root);
    else if (name === "index.html") out.push(relative(root, p));
  }
  return out;
}

function textOf(path) {
  const html = readFileSync(path, "utf8");
  const $ = cheerio.load(html);
  $("script, style").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

const filesA = new Set(walk(dirA));
const filesB = new Set(walk(dirB));

const onlyA = [...filesA].filter((f) => !filesB.has(f));
const onlyB = [...filesB].filter((f) => !filesA.has(f));

console.log(`Pages in A: ${filesA.size}, Pages in B: ${filesB.size}`);
if (onlyA.length) console.log("Only in A (missing in B):", onlyA);
if (onlyB.length) console.log("Only in B (missing in A):", onlyB);

let diffCount = 0;
for (const f of filesA) {
  if (!filesB.has(f)) continue;
  const a = textOf(join(dirA, f));
  const b = textOf(join(dirB, f));
  if (a !== b) {
    diffCount++;
    console.log(`\n--- TEXT DIFF: ${f} ---`);
    const minLen = Math.min(a.length, b.length);
    let i = 0;
    while (i < minLen && a[i] === b[i]) i++;
    console.log("A around diff:", JSON.stringify(a.slice(Math.max(0, i - 60), i + 120)));
    console.log("B around diff:", JSON.stringify(b.slice(Math.max(0, i - 60), i + 120)));
  }
}
console.log(`\nTotal pages with text differences: ${diffCount} / ${filesA.size}`);
