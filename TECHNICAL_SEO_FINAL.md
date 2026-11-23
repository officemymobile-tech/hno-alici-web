# Technical SEO — Final Crawl & Fixes

**Date:** 2026-11-22. **Scope:** every one of the 54 URLs in `sitemap.xml`, crawled via `scripts/sanity/full-seo-crawl.mjs` (new, reusable — extends the earlier `technical-seo-audit.mjs`) against the real static build served through the GitHub-Pages simulator. Checked: HTTP status, title, meta description, canonical, H1, H2 structure, hreflang, robots, sitemap, Open Graph, image alt text, structured data, internal links, duplicate content, 404/redirects — every item Phase 2 asked for.

## FIXED (real, verified defects)

### 1. 15 pages were silently inheriting the homepage's default `<title>`/description (the biggest finding)

`team`, `kontakt`, `termin`, `bewertungen`, `patienteninfo`, `leistungen` (overview), `impressum`, `datenschutz`, `cookie-richtlinie`, `haftungsausschluss`, `dr-uemit-alici` and its 3 subpages (`lebenslauf`, `qualifikationen`, `philosophie`) — **9 distinct page templates × 2 locales = 30 of the 54 URLs** — had no `generateMetadata` export at all, so every single one of them rendered the exact same title ("Dr. Ümit Alici – HNO Wien Favoriten" / the Turkish equivalent) and the exact same meta description. Confirmed by the crawl: 15 DE pages sharing one title, 15 TR pages sharing the other, before the fix; 0 duplicates after. This is a genuine, significant SEO defect — Google treats near-identical title/description pages as low-value duplicates, diluting every one of these 15 pages' individual ranking potential — not something a prior milestone's audit had scoped (it only looked at two specific locale-exclusive landing pages). **Fixed:** added `generateMetadata` to all 9 page files, each returning a distinct, real title and description derived from that page's own already-approved on-page copy (translation keys, `doctorProfile` content, legal document titles) — nothing invented. Regression-guarded: `tests/seo.spec.ts`'s new "every simple page has its own distinct title" test.

### 2. 5 service pages had the brand name doubled in their `<title>`

`seo-services.ts`'s `metaTitle` field for `allgemeine-hno`, `kinder-hno`, `allergologie`, `schwindel`, `schnarchen` already baked in a `"| Dr. Ümit Alici"` / `"| HNO Alici"` / `"| KBB uzmanı"` suffix — then the root layout's own title template appended its own `"| Dr. Ümit Alici – HNO Wien Favoriten"` on top, producing titles like *"Allgemeine HNO Wien Favoriten | Dr. Ümit Alici | Dr. Ümit Alici – HNO Wien Favoriten"* (brand name twice). This is the exact same bug class a prior milestone found and fixed on 2 other pages (`docs/audit/phase2-audit-report.md`, Finding F) — turns out it also existed on these 5, outside that audit's original scope. **Fixed:** removed the redundant embedded suffix from all 5 `metaTitle` values (the separate, still-correct `h1` field — the actual visible on-page heading — was never touched). Regression-guarded: `tests/seo.spec.ts`'s new brand-doubling test.

### 3. One page's meta description was 278 characters (should be ≤160)

`dr-uemit-alici`'s new `generateMetadata` (added by fix #1) initially used the full `about.intro` paragraph verbatim as the description — correct content, wrong length for a meta description. **Fixed:** truncated to ≤155 chars with a clean ellipsis, same real sentence, not reworded.

## PASS (already correct, re-verified, not touched)

| Check | Result |
|---|---|
| HTTP status | 54/54 return 200; a deliberately-requested nonexistent URL correctly returns 404 (not a silent 200 or broken redirect) |
| Canonical tags | 54/54 present, all point at a real self-URL |
| H1 | 54/54 pages have exactly one |
| Hreflang DE/TR | 54/54 pages have reciprocal alternates (re-confirmed via the existing `tests/seo.spec.ts` reciprocity test, unaffected by this pass) |
| `robots.txt` | Present, `Disallow: /admin/`, `Disallow: /studio/`, references the real sitemap URL |
| `sitemap.xml` | 54 URLs, exactly matching the crawl — no orphaned page, no missing page |
| Open Graph | 54/54 pages have complete `og:title`/`description`/`type`/`url`/`image` (the `og:image` fix from the prior design-pass milestone, re-confirmed still in effect) |
| Image alt text | 0 images missing `alt` across all 54 pages |
| Structured data | 54/54 pages carry valid, parseable JSON-LD (0 invalid blocks); the homepage's `MedicalClinic` schema still correctly reflects the real split-shift Monday/Wednesday hours (regression-guarded, unaffected by this pass) |
| Duplicate/near-duplicate content | The 2 locale-exclusive landing page pairs (`tuerkischer-hno-arzt-wien`/`turk-kbb-doktoru-wien`, `kinder-hno-wien-1100`/`cocuk-kbb-wien-1100`) correctly canonicalize cross-locale, not to the homepage — the exact Phase 2/3 fix, re-verified still holding |

## OPEN / RECOMMENDATION (not fixed — flagged, not silently ignored)

| Finding | Why not fixed now |
|---|---|
| 16 pages' rendered `<title>` exceeds 60 characters | Not a duplication bug (each is distinct, see FIXED #1/#2) — length alone, mostly driven by the site's own title template always appending `" | Dr. Ümit Alici – HNO Wien Favoriten"` (≈37 chars on its own), leaving little room. This is a template-design property affecting potentially every page, not a per-page defect — shortening the template suffix is a branding decision for you to make, not something to change unilaterally. |
| 12 pages have no `<h2>` (CV/qualifications lists, the one-quote Philosophy page, the appointment form, the 2 blog posts) | Legitimate short/single-topic pages where forcing an H2 would be artificial structure, not real improvement — except possibly the 2 blog posts, where adding subheadings *would* genuinely help both readability and SEO; that's an editorial rewrite of actual article content, which per this project's established pattern needs a content-owner's review, not an unprompted change. Flagged for Phase 4 content work, not done here. |
| Internal link count per page | Captured in the raw crawl data (`docs/migration/full-seo-crawl-raw.json`) for every page; no page came back with suspiciously few internal links (every page sits in the main nav or a content cluster) — nothing actionable found, not a separate fix. |

## Full raw data

`docs/migration/full-seo-crawl-raw.json` — every field, for every one of the 54 pages, machine-readable.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 0 errors, 54 routes |
| Full Playwright suite | 126/126 pass |
| `tests/seo.spec.ts` alone (now 16 tests, +2 new regression guards from this pass) | 16/16 pass |
