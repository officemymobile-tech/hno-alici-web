# Performance Report

**Date:** 2026-11-22. Measured against the real static build (`out/`, `next build` + the GitHub-Pages simulator — not `next dev`) via `scripts/sanity/perf-check.mjs`, at mobile (390px) and desktop (1440px) viewports, on 3 representative pages: home, a service detail page, team.

## Tooling note

The Lighthouse CLI was not available in this session (same `npx` permission-classifier restriction noted in `TECHNICAL_SEO_REPORT.md`). `scripts/sanity/perf-check.mjs` measures real Navigation Timing API values (TTFB, First Contentful Paint, DOMContentLoaded, load event) and real transferred bytes per resource type via Playwright directly — not a Lighthouse score, but real milliseconds and real bytes, which is what actually matters here. Kept as a reusable script.

## Before → after (the one real fix this pass made: image encoding)

A **true before/after** wasn't preserved as a separate build (the `out/` directory was rebuilt in place) — the numbers below are from this session's own first measurement pass, taken before the image-encoding fix, against this same build:

| Page (mobile, 390px) | Total transferred, before | Total transferred, after | Image weight, before | Image weight, after |
|---|---|---|---|---|
| `/de/` | 3407KB | **1434KB** (−58%) | 2431KB | 456KB |
| `/de/leistungen/allgemeine-hno` | 3180KB | **1246KB** (−61%) | 2292KB | 357KB |
| `/de/team` | 3236KB | **1262KB** (−61%) | 2347KB | 372KB |

Root cause and fix: see `TECHNICAL_SEO_REPORT.md` — 5 of 7 "pro" photo assets were PNG files mislabeled `.jpg` (1.8–2.1MB each for a photo, because PNG is lossless); re-encoded as genuine JPEGs at the same dimensions, no content change, ~93–95% smaller each.

## Current state (after the fix), all 3 pages × both viewports

| Page | Viewport | FCP | DOMContentLoaded | Load event | Requests | Total transferred |
|---|---|---|---|---|---|---|
| `/de/` | mobile | 184ms | 54ms | 244ms | 26 | 1434KB |
| `/de/` | desktop | 232ms | 47ms | 241ms | 26 | 1434KB |
| `/de/leistungen/allgemeine-hno` | mobile | n/a* | 45ms | 174ms | 24 | 1246KB |
| `/de/leistungen/allgemeine-hno` | desktop | 184ms | 37ms | 178ms | 24 | 1246KB |
| `/de/team` | mobile | n/a* | 49ms | 159ms | 21 | 1262KB |
| `/de/team` | desktop | 116ms | 43ms | 184ms | 22 | 1284KB |

\* Playwright's `first-contentful-paint` entry is occasionally not reported for a same-machine localhost load that completes faster than the paint-timing API fires a distinct entry — not a real absence of paint, a measurement artifact of testing against `localhost` with no network latency. Not something to "fix" — flagged so the number isn't misread as a regression.

These are **localhost** measurements (no real network latency, no CDN, no real device CPU throttling) — they establish relative improvement and flag remaining weight, not an absolute real-world score. A real Lighthouse mobile run (ideally on the actual hosting target) is still the right tool for an absolute score; this session's numbers are the best available substitute.

## Remaining observations (not changed — out of scope for a "no speculative optimization" pass)

- `script` weight (~700KB across all 3 pages) is Next.js's own framework + hydration bundle — not something this pass touched, since it's framework baseline, not a page-specific regression, and the constraint was "optimize only what the measurements actually show," not a framework swap.
- `logo.png` (97KB) is a flat vector-style logo served as PNG at every page load (it's in the Header, present on every page) — a reasonable future candidate for SVG conversion (would be near-lossless and much smaller), flagged but not changed here since it needs the original vector source, not something to regenerate from the raster PNG without risking quality loss.
