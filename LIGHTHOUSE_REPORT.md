# Performance Report (Phase 5)

**Date:** 2026-11-22.

## Tooling: Lighthouse was attempted, denied — a real permission request, not a silent fallback

Per your explicit instruction ("Falls Berechtigungen fehlen, fordere die nötige Freigabe an"), the real Lighthouse CLI was attempted directly this time (`npx lighthouse http://localhost:8092/de/ --preset=desktop ...`), not skipped. It was denied by the auto-mode permission classifier (reason: "Undermining Oversight" — running an unreviewed npm package via `npx` without supervision). **This is a real, standing request for your approval, not a cosmetic note:** if you want a literal Lighthouse score (the 0–100 Performance/Accessibility/SEO/Best-Practices numbers), you'd need to either grant Bash permission for `npx lighthouse` specifically, or run it yourself locally (`npx lighthouse http://127.0.0.1:3000/de/ --view`) and share the result — I can analyze it either way.

**What was measured instead:** real Navigation Timing API data, real Largest Contentful Paint and Cumulative Layout Shift (via `PerformanceObserver`, the same browser APIs Lighthouse itself reads from — not estimated), and real transferred bytes — via `scripts/sanity/perf-check-full.mjs` (new, reusable), against the actual static build (not `next dev`), for all 5 requested pages, mobile and desktop.

## INP — explicitly not documented, per your own condition

You asked for INP "only if suitable field data or robust interaction measurements are available." Neither exists: there is no real-user field data (no analytics pipeline on this site), and a synthetic/lab INP number would require scripting a plausible sequence of real user interactions (tapping a specific button, opening the mobile menu, filling a field) and measuring input-to-paint latency for each — done honestly, that's a meaningful exercise, but inventing interaction patterns with no basis in real usage would produce a number that looks precise but measures nothing real. Not fabricated here, per your own instruction.

## Results — all 5 pages, mobile (390px) + desktop (1440px)

| Page | Viewport | FCP | LCP | CLS | DOMContentLoaded | Load event | Requests | Total transferred |
|---|---|---|---|---|---|---|---|---|
| Homepage | mobile | 200ms | 200ms | 0 | 67ms | 268ms | 44 | 1406KB |
| Homepage | desktop | 240ms | 240ms | 0 | 48ms | 258ms | 58 | 1932KB |
| Leistungen | mobile | 168ms | 204ms | 0 | 40ms | 227ms | 39 | 1671KB |
| Leistungen | desktop | 236ms | 260ms | 0 | 60ms | 230ms | 52 | 1726KB |
| Team | mobile | 148ms | 164ms | 0 | 39ms | 159ms | 38 | 1376KB |
| Team | desktop | 168ms | 184ms | 0 | 48ms | 170ms | 49 | 1430KB |
| Arztprofil (dr-uemit-alici) | mobile | 168ms | 168ms | 0 | 50ms | 167ms | 37 | 1197KB |
| Arztprofil (dr-uemit-alici) | desktop | 172ms | 172ms | 0 | 44ms | 167ms | 58 | 1255KB |
| Kontakt | mobile | 184ms | 276ms | 0 | 61ms | 194ms | 38 | 1379KB |
| Kontakt | desktop | 192ms | 244ms | 0 | 53ms | 227ms | 50 | 1413KB |

**CLS is 0 on every single page** — confirms the font-swap fix (Plus Jakarta Sans's `next/font` auto-generated fallback metrics) holds across the whole site, not just the homepage hero checked in the typography pass.

## Honest caveat (same one carried from the earlier performance passes, still true)

These are **localhost** measurements: no real network latency, no CDN, no real device CPU throttling, no real-world connection variance. They're genuinely useful for **relative** comparison (did a change make a page heavier or lighter, did CLS regress) and for spotting real problems (e.g. the earlier milestone's 2.1MB-PNGs-mislabeled-as-JPEG bug, found this way). They are **not** a substitute for an absolute Lighthouse mobile score on real infrastructure — that's exactly the gap the denied `npx lighthouse` call would have closed, and exactly what's being asked of you above.

## Before/after (nothing changed in this pass that should move these numbers)

No image, bundle, or font change happened in this Phase 1–6 pass (Premium Footer + SEO milestone) — the typography/image fixes were the *previous* milestone, already reported in `PERFORMANCE_REPORT.md` (image encoding, −58%) and `FINAL_AQUA_TYPOGRAPHY_REPORT.md` (CLS=0 confirmed then too). This report is a **fresh, independent re-measurement** confirming those gains still hold after the footer/SEO changes, not a new optimization pass — consistent with Phase 5 only asking for measurement + reproducible before/after, not new tuning work.

## Reproducibility

`node scripts/sanity/perf-check-full.mjs http://localhost:<sim-port>` — same command, same 5 pages, same 2 viewports, deterministic enough (localhost, no external variance) to re-run after any future change and diff directly.
