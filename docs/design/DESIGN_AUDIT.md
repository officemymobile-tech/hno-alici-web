# Design Audit — Baseline

**Date:** 2026-11-21. **Method:** fresh `npm run build`, served via `scripts/sanity/gh-pages-sim-server.mjs` (production-equivalent static output, not `next dev`), screenshotted with Playwright at 320/360/390/430/768/1024/1440px across 7 DE pages (home, team, leistungen overview, a service detail page, kontakt, termin, doctor profile) plus a TR homepage spot-check (390/1440) — 51 screenshots total in `docs/design/screenshots/baseline/`. Every claim below cites the exact file(s) it's based on.

## Overall impression

This already reads as a professional, trustworthy medical practice site, not a generic template (`de-home-1440.png`, `de-kontakt-1440.png`). The petrol/gold/cream palette is used consistently, the serif display font (Cormorant Garamond) for headings against the sans body font (DM Sans) gives an appropriately calm, upmarket medical feel, and the homepage's structure (hero → acute-care CTA → doctor cards → services → trust signals/reviews → FAQ → location/hours → footer) is a sensible, complete information architecture. This is not a candidate for a ground-up redesign — it needs targeted polish, consistent with the "no redesign without justified reason" constraint.

## Navigation

Desktop (`de-kontakt-1440.png`): a top info bar (open/closed status, acute-care note, phone) above the main nav (logo, Ordination/Leistungen-dropdown/Team/Bewertungen/Aktuelles-dropdown/Kontakt/Dr. Ümit Alici, locale switch, a prominent "Termin" button) — clear, appropriately dense for a medical site, not cluttered. Mobile (`de-termin-390.png`): collapses to a hamburger menu with the same status bar and phone CTA retained at top — good, keeps the highest-priority action (call) visible without opening the menu.

## Typography

Headings consistently use the display serif at a sensible size scale across pages (`de-home-1440.png`'s "Dr. Ümit Alici" H1, `de-kontakt-1440.png`'s "Kontakt & Anfahrt" H1, `de-termin-390.png`'s "Terminanfrage senden" H1) — no inconsistency found in the sampled pages.

## Color palette

Confirmed in use exactly as defined in `globals.css`: petrol-dark hero/footer backgrounds, gold accents on buttons/badges/ratings, cream page backgrounds, white cards. The WCAG-AA `--color-gold-ink` fix from the prior milestone is visible correctly in practice — e.g. the "Alle Kassen und privat" gold banner and eyebrow labels read clearly against their backgrounds in `de-home-1440.png`.

## Component patterns — the one real inconsistency found

**Team page, doctor cards vs. staff cards (`de-team-390.png`, confirmed by reading `src/app/[locale]/team/page.tsx`) — concrete, not subjective.** The three doctors (Dr. Ümit Alici, Dr. Sigrid Meier, Dr. Benjamin Alici) each get a large photo-led card (3:4 portrait photo on top, name/title below, `rounded-2xl`). The 9 staff members (Frau Tadic, Frau Yildizdal, etc.) *are* individually cards too (`rounded-xl`, shadow, ring) — not a bare list — but each shows a small generic "health" icon (unrelated to the specific person) instead of any photo-like element, in a much lower-visual-weight horizontal icon+text layout. At mobile widths (`sm:grid-cols-2` doesn't apply below 640px) they stack into a single column, which reads as a plain list even though each row is technically a card. The real gap is the generic, person-agnostic icon, not the card/no-card distinction. Bounded fix: no staff photos exist in the data today (confirmed: `teamStaff`/the Sanity `staffMember` documents have no photo set), so replace the generic icon with a **person-specific initials avatar** (e.g. "RT" for Ruzica Tadic) in the brand palette, and align the card's visual rhythm (photo/avatar-on-top, text-below) closer to the doctor cards — without inventing any photo. The `staffMember` Sanity schema already has an optional `photo` field for future use; wire the display to prefer a real photo there if one is ever added, falling back to initials otherwise.

**Data-completeness gap behind that inconsistency (found while tracing the code, not just the screenshot):** the team page's 3 doctors come from `src/content/site-content.ts`'s `doctors` array — a **separate** data structure from `doctor-profile.ts` (which only has Dr. Ümit Alici's full bio) and from the Sanity `doctor` document type (which only migrated Dr. Ümit Alici in the prior milestone). Dr. Sigrid Meier and Dr. Benjamin Alici exist only in this one local array, with no Sanity equivalent — and `team/page.tsx` maps Dr. Benjamin Alici's portrait to `images.leistungenFoto10`, a **generic clinic/procedure photo reused as a stand-in portrait**, not a real photo of him. Flagged as a content/data gap for Phase 2 (design) and worth a note to the practice: either a real photo should be sourced for Dr. Benjamin Alici, or the placeholder should be visually distinct from an actual portrait (e.g., a plain avatar/initials) rather than a real clinical photo that could be mistaken for his likeness. Not fixed in this audit — flagged for the design-change phase with explicit instruction to use only real existing photos.

## Responsive behavior per breakpoint

No broken layout, no horizontal overflow indicators, and no clipped content was found in the sampled pages/breakpoints (`de-home-320.png` through `-1440.png`, `de-team-390.png`, `de-leistungen-768.png`, `de-kontakt-1440.png`, `de-termin-390.png`). Layouts collapse to single-column sensibly below ~768px and use multi-column grids above. One UX note, not a layout bug: the cookie-consent banner (`de-kontakt-1440.png`, `de-termin-390.png`) visually sits over part of the map / the phone-priority card on a fresh page load — this is real first-visit behavior (not a screenshot artifact, since every new visitor sees an unaccepted consent state), worth a lightweight accessibility/UX check in Phase 7 (does it trap focus awkwardly, does it block the primary CTA for too long) rather than a design-phase visual fix.

## Recommended, bounded Phase 2 scope (based on this evidence)

1. Staff list → consistent card treatment matching the doctor cards (highest-value, most concrete item).
2. Resolve or clearly flag the Dr. Benjamin Alici placeholder-photo situation (content question, escalate rather than silently fix).
3. Minor spacing/rhythm pass only where Phase 8's visual diff shows a regression from change #1 — no pre-emptive changes to sections that already read cleanly (hero, services, reviews, FAQ, footer all looked consistent and intentional in this sample).
