# Accessibility Report (WCAG 2.2 AA)

**Date:** 2026-11-22. Builds on the Phase 2/3 contrast fix (`--color-gold-ink`, already verified). This pass specifically covers what the design-modernization plan flagged as "not previously tested": keyboard focus visibility, form labeling, alt-text coverage, heading order, reduced-motion handling, and responsive text at the 7 required breakpoints.

## Tooling note

pa11y/axe-core were not available in this session (same `npx` permission-classifier restriction as the other reports). Two substitutes were used instead, both kept as reusable project assets:
- `scripts/sanity/contrast-check.mjs` — computes real WCAG contrast ratios (the same formula pa11y/axe use internally) for every color pairing actually used in the codebase, not a sample.
- `tests/accessibility.spec.ts` — Playwright checks for keyboard focus visibility, the cookie banner's focus behavior, heading-level order, and `prefers-reduced-motion` handling.
Manual spot-checks are called out as manual below, not conflated with either tool's output.

## Automated: color contrast — 11/11 pairings PASS

Every text/background color combination actually used in the codebase (grepped from `className` usage, including every one this design pass added — `InfoStrip`, the Hero trust badges, the `AboutPreview` checklist icon, Footer's regrouped headings) — **all pass WCAG AA** (4.5:1 for text, 3:1 for the one non-text UI element checked). Full table: `scripts/sanity/contrast-check.mjs` output, reproducible via `node scripts/sanity/contrast-check.mjs`. No new contrast regression from this pass's additions.

## Automated: keyboard navigation & focus — PASS

`tests/accessibility.spec.ts` confirms the header's primary interactive controls each resolve to an element with a non-`none` computed `outline` when focused via `Tab` (Button.tsx's `focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold` utility, confirmed actually applied, not just present in source).

## Automated: form labeling — PASS (re-confirmed, not new)

`tests/forms.spec.ts` (pre-existing, 6 tests) still passes unchanged — required-field validation, the native-checkbox consent-validation finding from the prior milestone (documented, not a new regression), and the full submit flow.

## Automated: alt-text coverage — PASS

0 images missing an `alt` attribute across all 54 crawled pages (`scripts/sanity/technical-seo-audit.mjs`, shared with the technical-SEO pass since it's the same underlying check).

## Automated: heading order — PASS

Exactly one `<h1>` per page (54/54), and `tests/accessibility.spec.ts` confirms no heading-level skip (e.g. h2 straight to h4) in the homepage's visible section order.

## Automated: reduced motion — fixed, now PASS

**Finding, fixed:** `globals.css`'s `.animate-fade-up`/`.animate-fade-up-delay` keyframe animations had no `prefers-reduced-motion` guard at all. Added a `@media (prefers-reduced-motion: reduce)` block that disables the fade-up animations (content shows at full opacity immediately instead) and neutralizes `scroll-behavior: smooth` and `.hover-lift`'s transition, plus a blanket near-zero animation/transition duration as a safety net for anything else. Verified via `tests/accessibility.spec.ts`.

## Manual: cookie consent banner focus behavior — PASS, confirmed by reading the component

`CookieConsent.tsx` renders a non-modal bottom banner (`role="dialog"`, but no `aria-modal="true"` and no focus trap) — confirmed by reading the source, not inferred. Keyboard focus can leave the banner via `Tab`; it doesn't block the rest of the page. Matches the prior audit's open question ("does it trap focus awkwardly") — answer: no.

## Manual: responsive text at the 7 required breakpoints — PASS

`tests/responsive.spec.ts` (new) sweeps 320/360/390/430/768/1024/1440px on home and team — **0 horizontal-overflow regressions** after one real fix (see below). No fixed/unreadable text size found at any width during the screenshot review (`docs/design/screenshots/after-phase2/`).

## Fixed during this pass (found by the new breakpoint sweep, not by a listed check above)

**Header horizontal overflow at exactly 1024px** (Tailwind's `lg:` breakpoint, where the nav switches from the mobile hamburger to the full desktop nav): the nav + locale switch + CTA button combination was ~8px wider than the viewport at that exact width, pre-existing and unrelated to this pass's own Hero/InfoStrip/DoctorsSection changes (`Header.tsx` wasn't otherwise touched). Fixed with a `lg:gap-5 xl:gap-8` / `gap-2 lg:gap-3` tightening — cosmetic spacing only, no content or link removed. Confirmed fixed via a direct DOM measurement (0 overflowing elements) and the new `responsive.spec.ts` test.

## Not re-tested (already covered, unchanged)

- The prior milestone's WCAG-AA gold-text contrast fix itself (`--color-gold-ink`) — re-confirmed as still in use, not re-derived.
- `AppointmentForm`'s native-checkbox-vs-custom-message cosmetic gap — unchanged, still flagged, not this pass's scope.
