# Design Changes — Reference-vs-Live Comparison & Implementation Log

**Reference:** `design-reference/design-reference.png.png` (1024×1536 composite mockup, not a literal viewport screenshot — read as visual direction: hierarchy, palette, component language, spacing rhythm).
**Live baseline:** `http://127.0.0.1:3000/de/`, captured at `docs/design/screenshots/current/de-home-desktop-1440.png` / `-mobile-390.png` before any change in this pass.
**Method:** section-by-section comparison of the reference against the current rendered homepage and its source components (`src/app/[locale]/page.tsx` and children), cross-checked against `docs/design/DESIGN_AUDIT.md` (prior milestone's findings, not re-litigated where still valid).

## Already matching the reference (left alone, not rewritten)

- Palette (petrol/gold/cream), Cormorant Garamond display + DM Sans body — exact token match (`globals.css`), confirmed correct in both milestones.
- Overall information architecture order: hero → urgent-care → services → doctor → reviews/trust → FAQ → location → footer — same sequence as reference, no reordering needed.
- `FaqSection`, `LocationSection` (map + contact + hours), `GoogleBusinessCTA` — structure, copy and visual weight already close to the reference's equivalent sections.
- Header navigation structure (logo, links, locale switch, CTA button, mobile hamburger) — already functionally equivalent to the reference's nav bar.
- `team/page.tsx` already uses real photos where they exist and **initials avatars for the 9 staff members** (not a generic icon) — the audit's staff-card recommendation was already implemented in a prior pass.

## Priority 0 — content-integrity bug (fix first, independent of visual work)

| # | Issue | File | Fix |
|---|---|---|---|
| 1 | **Dr. Benjamin Alici is shown with `leistungenFoto10`, a generic clinic photo, as his portrait** — a real person misrepresented by an unrelated image. No verified real photo of him exists. | `src/app/[locale]/team/page.tsx:39` | Replace the photo mapping with the same initials-avatar pattern already used for staff (petrol background, gold-light initials "BA") instead of any photo. |

## Priority 1 — structural/visual gaps with real impact

| # | Section | Reference shows | Live currently shows | Action |
|---|---|---|---|---|
| 2 | Hero | 3 small icon+label trust badges under the CTAs ("Erwachsene & Kinder", "Moderne Diagnostik", "Erfahren & Vertrauensvoll") | Nothing there — CTAs end the hero content | Add the 3-badge row, reusing existing trust copy/icons (no new claims) |
| 3 | Below hero | One flat, full-width, calm info strip (status / hours / phone / address, 4 columns, light background) | A floating white card (`AcuteBanner`, `-mt-12` overlapping the hero) mixing "Akutversorgung" messaging into that slot | Add a dedicated `InfoStrip` component matching the reference's 4-column pattern; keep `AcuteBanner`'s urgent-care message and phone CTA as its own clearly separated section right after (not deleted — it's a real, valued business feature — just no longer visually overlapping/competing with the hero edge) |
| 4 | Homepage doctor section | All 3 doctors shown with real photo-led cards | `DoctorsSection` is **text-only** (name + title, no photo at all, not even for Dr. Alici whose portrait already exists) | Rebuild as photo-led cards (real portraits for Alici/Meier, initials avatar for Benjamin — same fix as #1, same component pattern as the already-correct Team page) |
| 5 | "Ihr HNO-Facharzt" section | 3-item checkmark list under the intro paragraph | `AboutPreview` has title + intro + quote + button, no checklist | Add a 3-item checklist, worded as a direct, tightened restatement of the **already-approved** `about.expectations` copy (no new medical claims, nothing needing fresh doctor sign-off) |

## Priority 2 — polish, consistency, lower risk if skipped

| # | Section | Note | Action |
|---|---|---|---|
| 6 | `ServicesPreview` | Reference's 4 service cards use category photos; the live site's content model has only 3 real categories (`allgemeine-hno`, `kinder-hno`, `allergologie`) and no verified per-category photography exists for an "Ohren/Nase/Rachen" split | **Not** inventing a 4th category or stock photos (would violate the "no fabricated Leistungen/images" constraint) — instead lift the existing 3 icon cards to the reference's visual weight (larger icon tile, consistent hover/arrow affordance) |
| 7 | `TrustGrid` + `InsuranceBanner` | Reference folds "why choose us" into the reviews section as a light icon+label row and never shows a full-bleed gold insurance band | Both are real, working, independently useful sections — kept, but visually lightened (`InsuranceBanner` toned down, `TrustGrid` cards de-weighted) rather than removed/merged, to avoid rewriting working components beyond what the reference actually justifies |
| 8 | `Footer` | Reference: clean 3 columns + a social icon | Live: 2 content columns, one very dense | Regroup into 3 columns (Schnellzugriff / Patienteninfo / Rechtliches) — same links, same count, just regrouped — add the existing Facebook link (`facebookUrl`, already in `site-content.ts`, currently unused anywhere) as a social icon |

## Implemented (confirmed)

All of #1–#8 above are implemented, build-verified, and covered by the new `tests/responsive.spec.ts` assertions (doctor photo cards, info strip, footer regrouping, About checklist all asserted present). After-screenshots: `docs/design/screenshots/after-phase2/`. Full verification run and remaining findings: `FINAL_RELEASE_READINESS.md`.

**Superseded/expanded:** after this doc was written, explicit feedback rejected this pass as too conservative — the Hero, floating info bar, and Services were rebuilt as genuine visual redesigns (not cosmetic tweaks), followed by the Doctor Section, Reviews & Trust, FAQ, Contact, Footer, and mobile layout. Full iteration-by-iteration log, including a real bug found and fixed (a CSS Grid mobile overflow in the Doctor section): `docs/design/VISUAL_QA.md`.

## Explicitly not changed

- `ReviewsSection`'s 3-card review grid (vs. reference's single-testimonial carousel with dot pagination) — functionally equivalent, lower implementation risk, not worth a new carousel component for a cosmetic difference.
- No new/invented photography anywhere. No new Leistungen pages or medical claims. Sanity integration, `CONTENT_SOURCE` gating, and all prior-milestone SEO/accessibility fixes untouched.

## Execution order

1. Fix #1 (Benjamin Alici photo) — also feeds #4.
2. #4 DoctorsSection photo cards.
3. #2 + #3 Hero trust badges + InfoStrip + AcuteBanner repositioning.
4. #5 AboutPreview checklist.
5. #6/#7/#8 polish pass.
6. Full rebuild, lint, Playwright regression, before/after screenshots.
7. Technical SEO + Local SEO + Performance + Accessibility reports (separate milestone phases, not skipped).
