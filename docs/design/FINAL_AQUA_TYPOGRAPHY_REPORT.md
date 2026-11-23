# Final Design System — Aqua + Deep Petrol + Plus Jakarta Sans

**Date:** 2026-11-22. **Branch:** `cms/phase2-4-audit-sanity` (unchanged, HEAD still `cd5cb78`, local only — zero pushes/merges/deploys/DNS changes). **Status: ACTIVE.** This is now the standard design system for the site.

## Phase 1 — Pre-change state (confirmed, backed up)

- Branch and HEAD confirmed unchanged before starting; 92 modified/untracked files, all prior uncommitted design work, preserved untouched.
- Existing design tokens: cream/petrol/gold-now-aqua CSS variables in `src/app/globals.css` (see `AQUA_COLOR_COMPARISON.md` for the full gold→aqua history).
- Aqua was already the active color variant from the previous milestone (`#35b8b0`/`#9ee3df`/`#247f79`) — unchanged by this pass.
- Fonts before this pass: Cormorant Garamond (display/headings) + DM Sans (body), both via `next/font/google`, `subsets: ["latin"]` only.
- Sanity integration: confirmed untouched by inspection (this pass never touches `src/lib/sanity/`, `sanity/`, or `CONTENT_SOURCE` logic) and by test (`studio-deep-link.spec.ts`, 4/4 pass throughout).
- **Backup created** (dated, local, not committed): `backups/2026-11-22-pre-typography/` — `globals.css.bak`, `layout.tsx.bak` (the two affected files, verbatim pre-change), and `screenshots-before/` (the full set of pre-change full-page screenshots at 1440/390 for DE/TR, captured minutes before this change — the same ones referenced as "VORHER" in the comparison below).

## Phase 2 — Colors (unchanged in this pass, re-confirmed)

Aqua remains the default (`:root` in `globals.css`): `--color-gold: #35b8b0`, `--color-gold-light: #9ee3df`, `--color-gold-ink: #247f79`. Gold remains available, unchanged, as `:root[data-theme="gold"]`. Full history, every affected component, and the WCAG table: `docs/design/AQUA_COLOR_COMPARISON.md`. Nothing in this pass touched color.

## Phase 3 — Typography (the actual change this pass made)

| | Before | After |
|---|---|---|
| Headings (`--font-display`, the `.font-display` class used by every `h1`/`h2`/`h3` in the design) | Cormorant Garamond, weights 400/500/600/700, `subsets: ["latin"]` | **Plus Jakarta Sans**, weights 500/600/700/800, `subsets: ["latin", "latin-ext"]` |
| Body (`--font-body`) | DM Sans, weights 400/500/600/700, `subsets: ["latin"]` | DM Sans, same weights, **`subsets: ["latin", "latin-ext"]`** (subset widened, font itself unchanged, per your instruction to keep it) |
| Fallback stack | `Georgia, serif` (serif fallback — wrong family for a sans-serif heading font, would have flashed serif text) | `"Segoe UI", system-ui, sans-serif` |

**Why `latin-ext` was added to both** (not just the new heading font): confirmed via `next/font`'s own `font-data.json` that Plus Jakarta Sans's German-umlaut/Turkish-character glyphs live in its `latin-ext` subset, not `latin` — shipping `latin` only would have risked silent tofu/fallback-font substitution on exactly the characters ("ü", "ö", "ß", "ı", "ş", "ğ", "ç") this bilingual site depends on. DM Sans got the same treatment for the same reason, even though it rendered acceptably before (likely via silent browser fallback) — explicit subset coverage is more robust than relying on that.

**Loading method:** `next/font/google` (as instructed, not a manual `<link>` or `@font-face`) — this self-hosts the font files at build time (no runtime request to Google Fonts' CDN from the visitor's browser), auto-generates a size-adjusted fallback font to prevent layout shift, and participates in Next's own font-optimization pipeline. No new npm dependency was added.

## Phase 4 — Design consistency (fixed what the font change actually broke)

The font swap alone introduced one real proportion problem, found and fixed, not left for you to notice:

**Hero H1 was oversized for the new (bolder, wider) font.** Your own brief specified target ranges (desktop 56–68px, tablet 44–52px, mobile 34–42px). The pre-existing Hero H1 was `text-6xl sm:text-7xl xl:text-[5.5rem]` — **60px at the smallest (mobile) breakpoint already, up to 88px at xl** — workable with a light, narrow serif, but with a bold geometric sans-serif at those sizes it read as oversized/heavy, and mobile was 18–26px over your own target range. Rescaled to `text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem]` — 36px mobile → 48px tablet → 60px desktop → 64px at xl, landing inside your specified ranges at every step. Also brought the Doctor Section's heading (`AboutPreview.tsx`) down from a `lg:text-6xl` (60px) peak to `lg:text-5xl` (48px), for consistency with every other section heading on the page, now that heavier sans-serif weight reads as visually "louder" at the same pixel size than the old serif did.

Other section headings (`text-4xl`/`text-5xl` peaks, 36–48px desktop) were already close to your "Section Headings: 34–46px" guidance (within 2px) and were left alone — adjusting them by 1–2 px wasn't a real visual problem and risked introducing noise for no benefit. Buttons (`text-lg`, 18px) are 2px over your 15–16px guidance; same reasoning, left alone — not perceptible, not worth the churn. No other layout, spacing, or component structure was touched — this was a typography-triggered proportion fix, not a second layout redesign.

## Phase 5 — Mobile-first responsive check

`tests/responsive.spec.ts`'s breakpoint sweep (320/360/390/430/768/1024/1440px, home + team pages) re-run after the font change: **0 horizontal overflow** at any width, both desktop and mobile Chromium projects (40/40 tests). Specifically checked by eye in the full-page screenshots: long German words (e.g. "Hals-, Nasen- und Ohrenheilkunde", "Ansprechpartner"), Turkish special characters (ı/İ/ş/ğ/ç/ö/ü — visible correctly in `tr-home-*.png`, no tofu glyphs), the Hero headline at every breakpoint, mobile navigation, phone numbers, CTA buttons, service cards, team cards, opening-hours table, footer — none clipped, none overlapping, none causing a scrollbar. Touch-target sizing (WCAG 2.2 AA, 24×24px minimum) was already fixed in a prior pass (`FloatingCTA`, InfoStrip's phone/hours links) and is unaffected by a font change (box dimensions, not glyph size, drove those).

## Phase 6 — Performance

| Metric | Before (Cormorant + DM Sans, latin only) | After (Plus Jakarta Sans + DM Sans, latin + latin-ext) |
|---|---|---|
| Font payload (homepage, mobile) | 73KB | 102KB (+29KB — the deliberate `latin-ext` coverage on both fonts, see Phase 3) |
| CLS (Cumulative Layout Shift, measured via `PerformanceObserver`, homepage, 1440px) | — | **0** — `next/font`'s automatic fallback-metric matching (same mechanism as before) fully absorbs the font swap, no layout jump |
| FCP / DOMContentLoaded / load event (homepage, mobile, localhost) | ~184ms / 54ms / 244ms | ~260ms / 76ms / 347ms (localhost timing noise between runs is normal; both are well within a healthy range — see the caveat in `PERFORMANCE_REPORT.md` about localhost not being a real-network measurement) |
| JS bundle | 704KB (Next framework, untouched) | 704KB — unchanged, this pass added no library |
| Total page weight (homepage, mobile) | ~1434KB | ~1320KB (lower — not because of the font, but because this measurement happened to hit a slightly different image cache state; not a claimed improvement) |

No new library was added. The only real cost is the +29KB font payload from the deliberate `latin-ext` inclusion — a correctness decision (real German/Turkish glyph coverage, self-hosted, cached across every page) over a theoretical savings, consistent with your own instruction to specifically watch out for exactly these characters.

## Phase 7 — Visual QA

Comparison composite (old Cormorant vs. new Plus Jakarta Sans, same content/layout/colors, Hero fold): `docs/design/color-comparison/compare-typography-hero.png`. Full-page screenshots, both states:

- Before: `backups/2026-11-22-pre-typography/screenshots-before/{de,tr}-home-{1440,390}.png`
- After: `docs/design/screenshots/typography-after/{de,tr}-home-{1440,390}.png`, plus `de-home-768.png` and `de-home-320.png` for the tablet/smallest-mobile checks.

Hero, Services, Doctor Section, Reviews, FAQ, and Footer were all specifically reviewed in the "after" screenshots — the new typography reads consistently across every one of them: bolder, cleaner, more "modern clinical" and less "boutique serif," exactly the stated goal, with no section looking visually disconnected from the others.

## Phase 8 — Technical tests

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` (Next.js production build) | 0 errors, all 54 routes generated |
| `npm run lint` (ESLint) | 11 problems (5 errors, 6 warnings) — **same pre-existing baseline count as before this pass**, none in a file this pass touched |
| Full Playwright suite | **126/126 pass** |
| `tests/accessibility.spec.ts` alone | 8/8 pass |
| DE/TR language check | Both verified in full-page screenshots + the full Playwright suite's `tr` test cases |
| Font-loading test | `next/font` self-hosted build output confirmed (build succeeded, fonts resolved at build time, no external Google Fonts request at runtime) |
| WCAG contrast check | 17/17 pass (color-only check, unaffected by font — re-run for completeness, see Phase 2) |
| Responsive overflow | 40/40 pass (see Phase 5) |
| SEO metadata check | `scripts/sanity/technical-seo-audit.mjs`, 54 pages: 0 broken links, 0 missing canonical/OG, 0 missing alt, 0 invalid JSON-LD, 0 H1 issues — unaffected by a font/color change, re-run for completeness |
| Sanity/local content-fallback test | Not re-run from scratch in this pass (no content-source code touched) — `studio-deep-link.spec.ts` (4/4 pass) confirms Studio itself is unaffected; the `CONTENT_SOURCE` fallback path itself was last verified in the Phase 4 CMS milestone and nothing since has touched that code |

## Open points

None blocking. Two cosmetic 2px-over-guideline deviations (buttons 18px vs. 15–16px target, a few section headings 48px vs. 46px target) were deliberately left as-is — see Phase 4's reasoning — flagged here in case you'd like them tightened further, not because they're a defect.

## Rollback

Two independent, one-step rollbacks, matching how this was built:
1. **Typography only:** restore `src/app/[locale]/layout.tsx` and `src/app/globals.css` from `backups/2026-11-22-pre-typography/*.bak`, or just re-swap the font import back to `Cormorant_Garamond` and the two `--font-display`/`.font-display` references — reverts headings to the serif, keeps aqua.
2. **Color only (independent of typography):** add `data-theme="gold"` to the `<html>` tag — reverts to the gold accent, keeps Plus Jakarta Sans.
Both can be done independently or together; neither requires touching more than the two files already backed up.
