# Aqua Color Redesign — Variant Comparison

**Date:** 2026-11-22. **Status: ACTIVATED.** Following your approval, Aqua (Variant B) is now the default theme in `src/app/globals.css`'s `:root` block. Gold (Variant A) is preserved, unchanged, as a documented, one-attribute rollback (`:root[data-theme="gold"]`) — see "Activation" at the end of this document for exactly what changed and how to revert. The comparison methodology, screenshots, and contrast data below are unchanged from the evaluation; only the "which one is live" fact has flipped.

## How the toggle works (so "not activated" is a verifiable fact, not a promise)

The whole swap is three CSS custom-property overrides in `src/app/globals.css`, scoped under `:root[data-theme="aqua"]`. No component file was touched — confirmed via `grep` that the gold hex values (`#c4a35a`/`#d4b87a`/`#876c30`) appear **nowhere** outside `globals.css`; every `bg-gold`/`text-gold-ink`/`border-gold`/`ring-gold` class in all 37 files that use one is driven entirely by the `--color-gold`/`--color-gold-light`/`--color-gold-ink` variables. The default `<html>` tag carries no `data-theme` attribute (confirmed by curling the live dev server), so Variant A renders exactly as before. Variant B only appears when a script or a manual toggle sets `data-theme="aqua"` on `<html>` — which is exactly how every Variant B screenshot below was produced.

## 1. Previous colors (Variant A — gold, current default)

| Token | Hex | Role |
|---|---|---|
| `--color-gold` | `#c4a35a` | Primary CTA buttons, large icons/UI on dark backgrounds |
| `--color-gold-light` | `#d4b87a` | Text on dark/gradient backgrounds (Footer headings, star ratings) |
| `--color-gold-ink` | `#876c30` | Small text/eyebrows on light backgrounds (computed AA-safe darken of gold) |

(`--color-petrol`/`-light`/`-dark`, `--color-cream`, `--color-text` — all untouched, both variants.)

## 2. New colors (Variant B — aqua)

| Token (same name, overridden value) | Hex | Role | Derivation |
|---|---|---|---|
| `--color-gold` → aqua | `#35b8b0` | Primary CTA buttons, large icons/UI on dark backgrounds | Your specified "New Aqua Accent" value, used as-is |
| `--color-gold-light` → aqua-light | `#9ee3df` | Text on dark/gradient backgrounds | Computed: lightened from the base aqua hue/saturation until it clears 4.5:1 against the **lightest** point of the Footer's gradient (`--color-petrol-light`), the hardest of the 3 gradient stops |
| `--color-gold-ink` → aqua-ink | `#247f79` | Small text/eyebrows on light backgrounds | Computed: darkened from the base aqua hue/saturation until it clears 4.5:1 against both `--color-cream` and `#ffffff` — base aqua itself only measures 2.29/2.43 there (fails), exactly the "keine helltürkisen kleinen Texte auf weißem Hintergrund" risk you flagged, so it's never used directly for small text |

Your supplied "Primary Dark Teal" (`#083A40`) and "Secondary Teal" (`#0D4D51`) are very close to the site's existing `--color-petrol-dark` (`#0f3339`) and `--color-petrol` (`#1a4a52`) — within a few percent in every RGB channel. Per your own instruction ("weiterhin hauptsächlich aus Dunkelpetrol... bestehen", "keine komplette Neugestaltung"), **the existing petrol tokens were left untouched** rather than nudged to match these almost-identical values — changing them would have been a petrol-palette redesign, not a gold→aqua accent swap, and wasn't asked for. Same reasoning for "Warm Off-White" (`#F7F8F6` vs. existing `--color-cream` `#faf8f5`) and "Dark Text" (`#142F33` vs. existing `--color-text` `#1c2426`) — left alone.

## 3. Contrast values (computed, `scripts/sanity/contrast-check.mjs`)

**17/17 pairings pass WCAG AA — 11/11 gold (unchanged), 6/6 aqua (new).**

| Pairing | Ratio | Minimum | Result |
|---|---|---|---|
| aqua-ink on cream | 4.52 | 4.5 | PASS |
| aqua-ink on white | 4.79 | 4.5 | PASS |
| aqua on petrol-dark (= petrol-dark text on aqua button bg) | 5.56 | 4.5 | PASS |
| aqua-light on petrol-dark | 9.34 | 4.5 | PASS |
| aqua-light on petrol | 6.76 | 4.5 | PASS |
| aqua-light on petrol-light (hardest of the 3 gradient stops) | 4.54 | 4.5 | PASS |

Every aqua pairing maps 1:1 onto the exact gold pairing it replaces (same usage site, same minimum threshold) — side-by-side in the script's output, not a separate ad-hoc check.

## 4. Screenshot comparison

All screenshots: `docs/design/color-comparison/{gold,aqua}/*.png`. Direct side-by-side composites (Variant A left, Variant B right, generated with `sharp`, not manually assembled): `docs/design/color-comparison/compare-*.png` — `hero-detail`, `services`, `doctor-section`, `contact`, `footer`, `reviews`. Full pages: `home-desktop-1440.png`, `home-mobile-390.png` for each variant.

Visual read: the aqua accent reads noticeably more modern and "medical-clean" against the unchanged dark petrol, while staying clearly secondary to it — petrol/white/cream still dominate every screenshot, aqua appears only where gold used to (buttons, eyebrows, icon accents, link highlights), confirming "nicht alles türkis färben" held in practice, not just in intent.

## 5. Affected components (all via the CSS-variable swap, zero component edits)

CTA buttons (`Button.tsx` primary variant, `Hero.tsx`'s phone CTA, `FloatingCTA.tsx`, `GoogleBusinessCTA.tsx`'s "Auf Google bewerten"), section eyebrows (all `text-gold-ink` instances: `InfoStrip`, `AcuteBanner`, `ServicesPreview`, `AboutPreview`, `ReviewsTrustSection`, `FaqSection`, `LocationSection`), `Hero.tsx`'s trust-badge icons, `ServicesPreview`'s "Mehr erfahren" arrow links, `Header.tsx`'s active-nav indicators that use gold, `StarRating.tsx` (both `tone="dark"` and `tone="light"`), `ReviewsTrustSection`'s Google-card ring highlight, `FaqAccordion`-adjacent accents, `Footer.tsx`'s column headings, `InsuranceBanner.tsx`/`InsuranceLogos.tsx`'s "Privat" badge, `StickyBar.tsx`'s phone pill, `AboutPreview.tsx`'s blockquote border and outlined button. All 37 files that reference a gold Tailwind class — confirmed via `grep`, not assumed.

## 6. Test results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors (CSS-only change) |
| `npm run build` | 0 errors, all 54 routes |
| Full Playwright suite (default/gold theme) | **126/126 pass** — confirms Variant A is byte-for-byte unaffected |
| `scripts/sanity/contrast-check.mjs` | 17/17 pass (11 gold + 6 aqua) |
| Mobile overflow (320–1440px) | Unaffected — this is a color-only change, no layout/spacing touched; prior breakpoint sweep (`tests/responsive.spec.ts`) still 100% green |
| DE/TR | Both verified in the comparison screenshots (DE) and by the full Playwright suite's `tr` test cases (which don't assert color, but confirm rendering/content parity is untouched) |
| Sanity CMS regression | Unaffected — this change is a static CSS file, nowhere near the Sanity client/Studio/`CONTENT_SOURCE` code paths; `studio-deep-link.spec.ts` (4 tests) still green |

## Activation (done)

`src/app/globals.css`'s `:root` block now defines `--color-gold: #35b8b0`, `--color-gold-light: #9ee3df`, `--color-gold-ink: #247f79` directly (the same values, same variable names — no component changed). The previous gold values moved into a `:root[data-theme="gold"]` block, documented in-file with a rollback comment. **To roll back:** add `data-theme="gold"` to the `<html>` element in `src/app/[locale]/layout.tsx`, or swap the two blocks' values back.

## Post-activation verification (full re-run, this is the live default now)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 0 errors, all 54 routes |
| Full Playwright suite | **126/126 pass** |
| `tests/accessibility.spec.ts` alone | 8/8 pass |
| `scripts/sanity/technical-seo-audit.mjs` (54 pages) | 0 broken links, 0 missing canonical/OG, 0 missing alt, 0 invalid JSON-LD, 0 H1 issues |
| `scripts/sanity/contrast-check.mjs` | 17/17 pass (both variants re-verified) |
| Sitewide template spot-check (DE: team, Leistungen overview + detail, Kontakt, Termin, Dr. Ümit Alici, Blog index + post, Bewertungen, Patienteninfo, a locale-exclusive landing page; TR: home, Team) | All render correctly — buttons, links, icons, header, footer all show the new aqua accent consistently, no invisible/low-contrast text found. Screenshots: `docs/design/color-comparison/sitewide-aqua/` |
| Final full-page screenshots | `docs/design/screenshots/final-aqua/{de,tr}-home-{1440,390}.png` |
| Sanity CMS / `/studio` | Unaffected — confirmed via `studio-deep-link.spec.ts` (4/4 pass), this is a static CSS change nowhere near the Sanity client/Studio code |

## Open items

None outstanding — all 6 affected-component categories were visually spot-checked across multiple page templates and both locales, nothing read as broken, invisible, or low-contrast.
