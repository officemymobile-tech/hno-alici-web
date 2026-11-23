// Full per-page technical SEO crawl (Phase 2 of the SEO milestone) — extends
// technical-seo-audit.mjs's checks with title/meta-description/H1/H2/
// hreflang/structured-data capture per page, plus sitewide duplicate-title
// and duplicate-meta-description detection. Same tooling constraint as
// before: linkinator/html-validate/pa11y/Lighthouse are not available this
// session (auto-mode classifier denies unsupervised npx), so this is a
// purpose-built script using only already-installed deps (cheerio).
import * as cheerio from "cheerio";
import fs from "fs";

const BASE = process.argv[2] || "http://localhost:8092";

async function listPages() {
  const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const $ = cheerio.load(sitemapXml, { xmlMode: true });
  const urls = [];
  $("url > loc").each((_, el) => urls.push($(el).text()));
  return urls;
}

function toPath(url) {
  return url.replace(/^https?:\/\/[^/]+/, "");
}

async function main() {
  const pages = await listPages();
  const report = [];
  const titleMap = new Map();
  const descMap = new Map();

  for (const url of pages) {
    const path = toPath(url);
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    const status = res.status;
    if (status >= 300 && status < 400) {
      report.push({ path, status, redirect: res.headers.get("location") });
      continue;
    }
    if (!res.ok) {
      report.push({ path, status, error: true });
      continue;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").first().text();
    const metaDesc = $('meta[name="description"]').attr("content") || "";
    const canonical = $('link[rel="canonical"]').attr("href") || "";
    const h1s = $("h1").map((_, el) => $(el).text().trim()).get();
    const h2count = $("h2").length;
    const hreflangs = $('link[rel="alternate"][hreflang]')
      .map((_, el) => ({ lang: $(el).attr("hreflang"), href: $(el).attr("href") }))
      .get();
    const ogComplete = ["og:title", "og:description", "og:type", "og:url", "og:image"].every(
      (p) => !!$(`meta[property="${p}"]`).attr("content"),
    );
    const jsonLdTypes = $('script[type="application/ld+json"]')
      .map((_, el) => {
        try {
          const parsed = JSON.parse($(el).contents().text());
          return parsed["@type"];
        } catch {
          return "INVALID";
        }
      })
      .get();
    const internalLinks = new Set(
      $('a[href^="/"]').map((_, el) => $(el).attr("href")).get(),
    ).size;
    const robotsMeta = $('meta[name="robots"]').attr("content") || "(none)";

    report.push({
      path,
      status,
      title,
      titleLen: title.length,
      metaDescLen: metaDesc.length,
      canonical,
      h1Count: h1s.length,
      h1: h1s[0] || "",
      h2count,
      hreflangCount: hreflangs.length,
      ogComplete,
      jsonLdTypes,
      internalLinks,
      robotsMeta,
    });

    const key = title.trim();
    if (key) titleMap.set(key, [...(titleMap.get(key) || []), path]);
    const dkey = metaDesc.trim();
    if (dkey) descMap.set(dkey, [...(descMap.get(dkey) || []), path]);
  }

  const duplicateTitles = [...titleMap.entries()].filter(([, paths]) => paths.length > 1);
  const duplicateDescs = [...descMap.entries()].filter(([, paths]) => paths.length > 1);

  fs.writeFileSync(
    "docs/migration/full-seo-crawl-raw.json",
    JSON.stringify({ pages: report, duplicateTitles, duplicateDescs }, null, 2),
  );

  console.log(`Crawled ${report.length} pages.`);
  console.log(`Non-200 (excluding handled redirects): ${report.filter((p) => p.error).length}`);
  console.log(`Missing/empty title: ${report.filter((p) => p.title !== undefined && !p.title).length}`);
  console.log(`Missing meta description: ${report.filter((p) => p.metaDescLen === 0).length}`);
  console.log(`Title too long (>60 chars): ${report.filter((p) => p.titleLen > 60).length}`);
  console.log(`Meta description too long (>160 chars): ${report.filter((p) => p.metaDescLen > 160).length}`);
  console.log(`Missing canonical: ${report.filter((p) => p.canonical === "").length}`);
  console.log(`H1 count !== 1: ${report.filter((p) => p.h1Count !== 1).length}`);
  console.log(`0 H2 (no subheading structure): ${report.filter((p) => p.h2count === 0).length}`);
  console.log(`Missing hreflang alternates (0 found): ${report.filter((p) => p.hreflangCount === 0).length}`);
  console.log(`Incomplete OG tags: ${report.filter((p) => !p.ogComplete).length}`);
  console.log(`No structured data (JSON-LD): ${report.filter((p) => p.jsonLdTypes?.length === 0).length}`);
  console.log(`Duplicate titles (exact match across >1 page): ${duplicateTitles.length}`);
  if (duplicateTitles.length) console.log(duplicateTitles.map(([t, p]) => `  "${t}" -> ${p.join(", ")}`).join("\n"));
  console.log(`Duplicate meta descriptions: ${duplicateDescs.length}`);
  if (duplicateDescs.length) console.log(duplicateDescs.map(([d, p]) => `  "${d.slice(0,50)}..." -> ${p.join(", ")}`).join("\n"));
}

main();
