#!/usr/bin/env node
/**
 * Monatlicher SEO-Report für hno-alici.at
 * Ausführen: node scripts/seo-report.mjs
 */

const keywords = {
  de: [
    "HNO Wien",
    "HNO Wien 1100",
    "HNO Favoriten",
    "Kinder HNO Wien",
    "HNO Arzt Wien",
    "Türkischer HNO Arzt Wien",
    "Allergietest Wien",
    "Schwindel Wien",
  ],
  tr: [
    "KBB Wien",
    "KBB Wien 1100",
    "Türk KBB Doktoru Wien",
    "Çocuk KBB Wien",
    "Alerji testi Wien",
  ],
};

const pages = [
  { path: "/de", keywords: ["HNO Wien", "HNO Favoriten"] },
  { path: "/de/kinder-hno-wien-1100", keywords: ["Kinder HNO Wien", "HNO Wien 1100"] },
  { path: "/de/tuerkischer-hno-arzt-wien", keywords: ["Türkischer HNO Arzt Wien"] },
  { path: "/de/leistungen/allergologie", keywords: ["Allergietest Wien"] },
  { path: "/de/leistungen/schwindel", keywords: ["Schwindel Wien"] },
  { path: "/tr/turk-kbb-doktoru-wien", keywords: ["Türk KBB Doktoru Wien"] },
  { path: "/tr/cocuk-kbb-wien-1100", keywords: ["Çocuk KBB Wien"] },
];

const date = new Date().toISOString().slice(0, 10);

console.log(`\n=== SEO Report hno-alici.at – ${date} ===\n`);
console.log("Ziel-Keywords DE:", keywords.de.join(", "));
console.log("Ziel-Keywords TR:", keywords.tr.join(", "));
console.log("\nLanding Pages:");
for (const p of pages) {
  console.log(`  ✓ https://hno-alici.at${p.path}`);
  console.log(`    Keywords: ${p.keywords.join(", ")}`);
}
console.log("\nNächste Schritte:");
console.log("  1. Google Search Console: Indexierung prüfen");
console.log("  2. Google Business Profile: Bewertungen sammeln");
console.log("  3. 2 Blog-Artikel/Monat veröffentlichen");
console.log("  4. Core Web Vitals in PageSpeed Insights messen\n");
