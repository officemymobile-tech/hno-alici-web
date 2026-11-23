# Final QA Report — Premium Footer Fix + Complete SEO Milestone

**Date:** 2026-11-22. **Branch:** `cms/phase2-4-audit-sanity` (unchanged, local only — zero pushes/merges/deploys/DNS changes throughout). **Status: the project is further along, but — per your own closing condition — not "finished" until you've reviewed the two still-open approval items below (Lighthouse permission, FAQ content sign-off). Everything else requested in this milestone is done and verified.**

## Summary by status

### FIXED

1. Header lost its translucency (`bg-white/95 backdrop-blur-md` → solid `bg-white` + deliberate shadow) — root cause of the "overlapping Google review section" complaint was a visual-definition problem, not a z-index/layout bug (full investigation: `PREMIUM_FOOTER_QA.md`).
2. `GoogleBusinessCTA` rebuilt — compact, deep-petrol, horizontal on desktop, same real data.
3. Footer — fixed a real dead CSS class (`hover:text-gold-light-light`, a typo with no effect), added column dividers, tightened spacing, smooth hover transitions, merged the emergency-notice/copyright closing area.
4. `FloatingCTA` reduced from a 2-button stack to 1 compact button (the actual fix behind the earlier Reviews-section overlap finding, re-verified here still holds).
5. **15 pages (30 URLs)** had no `generateMetadata` and were silently sharing the homepage's title/description — the single biggest SEO finding of this milestone. Fixed with real, distinct, non-invented metadata per page.
6. **5 service pages** had the brand name doubled in their `<title>` (an embedded suffix + the root template's own suffix). Fixed.
7. One new page's meta description was 278 characters. Truncated.
8. **Zero internal links** existed between the 7 service detail pages. Added a real "Weitere Leistungen" cross-link block + a link back to the overview — no new content invented.

### PASS (verified, unchanged, re-confirmed)

- TypeScript: 0 errors. Build: 0 errors, 54 routes. Lint: 11 problems, same pre-existing baseline, none in a touched file.
- **Full Playwright suite: 130/130 pass** (up from 126 at the start of this milestone — `tests/seo.spec.ts` gained 2 new regression guards for the duplicate-title/brand-doubling bugs fixed in this pass, run on both desktop and mobile Chromium projects, +4).
- `tests/accessibility.spec.ts`: 8/8.
- Contrast: 17/17 WCAG AA pairings pass (11 gold + 6 aqua).
- Responsive: 0 horizontal overflow at 320/360/390/430/768/1024/1440px.
- DE/TR: both locales verified across every check in this milestone (screenshots, crawl, Playwright `tr` cases).
- `robots.txt`/`sitemap.xml`: correct, 54/54 URLs match.
- Canonical, hreflang, Open Graph, image alt text, structured data: 54/54 pages pass.
- A deliberately-requested nonexistent URL correctly 404s (not a silent 200 or broken redirect).
- **Opening-hours/vacation consistency (the long-standing open item from the original Phase 2 audit):** verified by direct code audit — `src/lib/opening-hours-source.ts` resolves one single `ResolvedSchedule` (weekly hours **and** `closurePeriods` from Sanity's `closurePeriod` documents, confirmed wired in `src/lib/sanity/queries.ts`) that every consumer (`StickyBar`, `Header`, `HoursCard`, `InfoStrip`, `LocationSection`) now reads from — this was the prior milestone's Phase 5 fix; confirmed still fully wired, no second source of truth remaining anywhere in the codebase. **PASS, not re-opened.**
- Sanity CMS / Studio: untouched by this entire milestone (no file under `sanity/`, `src/lib/sanity/`, or `CONTENT_SOURCE` logic was edited) — confirmed by `studio-deep-link.spec.ts` (4/4 pass) and by direct inspection of the diff.

### OPEN / NEEDS_APPROVAL

| Item | What's needed |
|---|---|
| Literal Lighthouse score | `npx lighthouse` was attempted directly this session and denied by the permission classifier (unsupervised package execution). Real Navigation Timing/LCP/CLS data was measured instead (`LIGHTHOUSE_REPORT.md`) — genuinely useful, but not a 0–100 score. **Needs:** your explicit Bash permission grant for this one command, or you run it yourself and share the result. |
| 5 service pages' missing FAQs | Question *topics* proposed (`SEO_CONTENT_AUDIT.md`), not answers — writing real medical Q&A content needs the doctor, not an invented draft. |
| Google Business Profile / directory NAP accuracy | A live search surfaced a possibly-stale Herold directory listing (`LOCAL_SEO_FINAL.md`, Finding 3) — carried forward from the original Phase 2 audit's Finding E, still unresolved, still needs a human with account access. |

### BLOCKED (not by choice — tooling, documented each time it came up)

- `linkinator`/`html-validate`/`pa11y`/Lighthouse CLI — all require unsupervised `npx`, denied by the auto-mode classifier every time attempted (3 separate milestones now). Substituted with purpose-built scripts (`scripts/sanity/*.mjs`) using only already-installed dependencies, each one clearly labeled as a substitute, not silently passed off as the real tool.

## All reports from this milestone

`PREMIUM_FOOTER_QA.md`, `TECHNICAL_SEO_FINAL.md`, `LOCAL_SEO_FINAL.md`, `SEO_CONTENT_AUDIT.md`, `LIGHTHOUSE_REPORT.md`, `FINAL_QA_REPORT.md` (this file).

## Screenshots

- Google CTA / header fix, all 5 required widths: `docs/design/screenshots/premium-footer-qa/google-footer-{1440,1024,768,390,320}.png`
- Floating-elements check: `docs/design/screenshots/premium-footer-qa/floating-elements-initial.png`
- New service-page internal links: `docs/design/screenshots/premium-footer-qa/service-internal-links.png`

## Local preview

`http://127.0.0.1:3000/de/` and `/tr/` both confirmed reachable (200) as of this report.

## Safety checklist (all honored, verified)

No pushes. No merges. No production deployment. No DNS changes. Sanity CMS fully preserved (confirmed, not just stated). Aqua + Deep Petrol + Plus Jakarta Sans design system preserved and unchanged. All prior uncommitted work preserved — branch `cms/phase2-4-audit-sanity`, HEAD still `cd5cb78`, nothing committed.
