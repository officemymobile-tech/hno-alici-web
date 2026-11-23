# Technical SEO Report — Verification + Close Remaining Gaps

**Date:** 2026-11-22. **Scope:** verification that the Phase 2/3 fixes (`docs/audit/phase2-audit-report.md`) still hold after this milestone's design changes, plus the two gaps that report explicitly deferred ("Open Graph tags and image-SEO ... not deeply covered before"). Method: `scripts/sanity/technical-seo-audit.mjs` (new, reusable — see note below on tooling) crawling every URL in `sitemap.xml` against the real static build served through `scripts/sanity/gh-pages-sim-server.mjs`, plus the existing Playwright `seo.spec.ts` regression guards.

## Tooling note

`linkinator`, `html-validate`, `pa11y` and the Lighthouse CLI (used ad hoc in the prior milestone) were not available in this session — the auto-mode permission classifier declined running un-reviewed packages via `npx` ("Undermining Oversight"). Rather than skip these checks, `scripts/sanity/technical-seo-audit.mjs` and `scripts/sanity/contrast-check.mjs` were written using only already-installed dependencies (`cheerio`, plain `fetch`) to directly replicate the specific checks those tools were covering: broken links, canonical/hreflang/OG presence, image alt coverage, JSON-LD validity, one-H1-per-page, and WCAG contrast math. Both are kept as reusable scripts (same convention as `scripts/sanity/verify-connection.mjs` etc.), not thrown away. If full linkinator/html-validate/pa11y/Lighthouse runs are wanted, that needs an explicit permission grant for unsupervised `npx` — your call, not assumed.

## Results — full site crawl (54 URLs from sitemap.xml)

| Check | Result |
|---|---|
| Broken internal links (every sitemap URL + every link discovered on each page) | **0 broken** |
| Pages missing `<link rel="canonical">` | **0** |
| Pages missing an Open Graph tag (`og:title/description/type/url/image`) | **0** (see fix below — `og:image` was missing site-wide before this pass) |
| Images missing an `alt` attribute | **0** |
| Invalid/unparseable JSON-LD blocks | **0** |
| Pages with an H1 count other than exactly 1 | **0** |

Raw data: `docs/migration/technical-seo-audit-raw.json`.

## Fix applied: site-wide missing `og:image` (new finding, not in the prior report)

`src/app/[locale]/layout.tsx`'s `generateMetadata()` set `openGraph.title/description/type/url` but never `images` — confirmed via `grep` that **no page anywhere in the codebase** set an OG image (only the root layout defines `openGraph` at all; no page overrides it, so the fix applies everywhere via Next's metadata inheritance). This meant every shared link (WhatsApp, Facebook, LinkedIn, Slack previews) rendered with no preview image. Fixed:
- Added `metadataBase` (was also missing — required for Next to resolve relative OG/Twitter image URLs to absolute ones).
- Added `openGraph.images` and a `twitter: { card: "summary_large_image", ... }` block, both pointing at the real ordination photo (`images.ordinationHero`, the same real photo already used in the Hero) — no new/invented image.

## Fix applied: oversized photo assets (performance ↔ technical SEO overlap — Core Web Vitals / LCP)

Found while instrumenting the performance check (see `PERFORMANCE_REPORT.md`): 5 of the 7 "pro" photo assets in `public/images/pro/` were actually **PNG files saved with a `.jpg` extension** (confirmed via `sharp().metadata().format`), each 1.8–2.1MB for a photographic image — PNG's lossless compression is a poor fit for photos, and this size directly hurts LCP (Largest Contentful Paint), especially on the hero photo which is above the fold on every page. Re-encoded as genuine JPEGs (`scripts/sanity/fix-image-encoding.mjs`, kept as a reusable script) at the same pixel dimensions — no crop, no resize, no content change, purely a codec/compression fix:

| File | Before | After |
|---|---|---|
| `ordination-hero-pro.jpg` | 2116KB | 141KB |
| `leistungen-foto-09-pro.jpg` | 2089KB | 154KB |
| `leistungen-foto-10-pro.jpg` | 1862KB | 96KB |
| `leistungen-overview-pro.jpg` | 1803KB | 102KB |
| `team-fr-alici-pro.jpg` | 1806KB | 101KB |

Visually verified (read back `ordination-hero-pro.jpg` after the re-encode) — no visible quality loss.

## Regression guards re-confirmed (Phase 2/3, via `tests/seo.spec.ts`, 8/8 pass both locales)

Title duplication, hreflang reciprocity, canonical correctness on the duplicate-content variants, and the opening-hours JSON-LD split-shift fix — all still correct after this milestone's component changes.

## Not touched (out of scope, no technical SEO issue found)

- `robots.ts`, `sitemap.ts` — already correct, disallow `/studio/` and `/admin/`, confirmed by `tests/seo.spec.ts`.
- `schema.ts`'s `Physician`/`MedicalClinic` JSON-LD structure — unchanged, still valid, still reflects the real split-shift hours.
