# Playwright QA Report

**Date:** 2026-11-22. Full suite run against the real static build (`out/`) via the GitHub-Pages simulator, both `desktop-chromium` and `mobile-chromium` (Pixel 7 emulation) projects.

## Result: 124/124 PASS

| Suite | Tests | New in this pass? |
|---|---|---|
| `content.spec.ts` | 14 | No — pre-existing, re-run |
| `forms.spec.ts` | 6 | No — pre-existing, re-run |
| `navigation.spec.ts` | 8 | No — pre-existing, re-run |
| `seo.spec.ts` | 6 | No — pre-existing, re-run |
| `studio-deep-link.spec.ts` | 4 | No — pre-existing, re-run |
| `responsive.spec.ts` | 19 | **Yes** — 7-breakpoint sweep (320/360/390/430/768/1024/1440px) on home + team, plus 5 assertions confirming this pass's new sections actually render (InfoStrip, doctor photo cards, Benjamin Alici initials avatar, regrouped footer, About checklist) |
| `accessibility.spec.ts` | 4 | **Yes** — keyboard focus visibility, cookie-banner focus behavior, heading order, reduced-motion |

(Each test runs on both `desktop-chromium` and `mobile-chromium`, hence 124 = 2 × 62 distinct test cases.)

## What the new specs caught

`responsive.spec.ts`'s breakpoint sweep found one real, pre-existing (not introduced by this pass) horizontal-overflow bug at exactly 1024px in `Header.tsx` — fixed, see `ACCESSIBILITY_REPORT.md` for detail. First run: 3 failures (2 genuine overflow findings at 1024px on home+team, 1 test-authoring bug — a `getByText` match needing `.first()` since the address correctly appears 3 times on the homepage: InfoStrip, LocationSection, Footer). All 3 resolved; full re-run after: 124/124 pass.

## Full JSON report

`docs/migration/playwright-report.json` (overwritten on every run per `playwright.config.ts`'s `reporter` config — this is the latest run's output, not cumulative history).

## Before/after screenshots

- Before (captured at session start, before any Phase 2 change): `docs/design/screenshots/current/{de,tr}-home-{desktop-1440,mobile-390}.png`
- After: `docs/design/screenshots/after-phase2/{de,tr}-home-{desktop-1440,mobile-390}.png`, `docs/design/screenshots/after-phase2/de-team-{desktop-1440,mobile-390}.png`
- Baseline (prior milestone, for the original 7-breakpoint × 7-page design audit): `docs/design/screenshots/baseline/`
