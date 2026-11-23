# Premium Footer / Review Section / Floating Elements QA

**Date:** 2026-11-22. Scope: the P0 header/Google-review overlap complaint, the Google review CTA redesign, the footer redesign, and a floating-elements interaction check.

## P0 — Sticky header "overlapping" the Google review section

**Status: INVESTIGATED, no structural bug found — root cause was a visual-definition problem, fixed without touching z-index.**

Reproduced with Playwright at 1440/1024/768/390/320px, checking the specific mechanisms requested:

| Mechanism checked | Finding |
|---|---|
| Sticky/fixed positioning | `Header` is `position: sticky; top: 0`, correctly, at all 5 widths. `StickyBar` (the dark status bar above it) is **not** sticky — confirmed, it scrolls away normally, so it never compounds with the Header. |
| Z-index | Header `z-50`, `FloatingCTA` `z-40`, `CookieConsent` `z-[60]` — a sane, intentional stack (consent banner always on top; header above body content; floating call button below both). **No change made** — a z-index bump was never the right fix and wasn't applied. |
| Scroll position | At every normal resting scroll position (section fully in view), the Google CTA's buttons sit well below the 73px header (measured: buttons at y=620–684px @1440px, header at y=0–73px — no overlap). |
| Section spacing / Header height | Header height is a constant 73px at every tested width (no responsive height jump that could desync assumed offsets). |
| Scroll-margin / overflow | `GoogleBusinessCTA` has no anchor `id` (nothing deep-links to it), so no `scroll-mt` was ever needed there. No `overflow` clipping found on any ancestor. |

**What was actually happening:** the previous Header used a **translucent** background (`bg-white/95` + `backdrop-blur-md`). Scrolling the Google section's dark petrol content *underneath* it (completely normal, correct sticky behavior — the header is *supposed* to stay visible) produced a washed-out, slightly-see-through white bar sitting on top of a solid dark section — readable, but visually inconsistent and "not premium" exactly as you described, especially compared to how the same translucent bar blends invisibly over the light/cream sections. That's a legitimate finding, just not a layout-mechanics bug.

**Fix:** `Header.tsx` — `bg-white/95 backdrop-blur-md` → solid `bg-white`, border opacity `cream-dark/80` → full `cream-dark`, and a deliberate shadow (`shadow-[0_1px_12px_rgba(8,58,64,0.12)]`) replacing the blur. The header now reads as a crisp, fully opaque, intentionally-separated bar over **any** section background, light or dark, with no translucency artifact. Verified visually at all 5 widths — screenshots: `docs/design/screenshots/premium-footer-qa/google-footer-{1440,1024,768,390,320}.png`.

## P1 — Google Review CTA

**Status: FIXED.** `GoogleBusinessCTA.tsx` rebuilt:
- Background: `bg-petrol` (mid-tone) → `bg-petrol-dark` (deep petrol, matching the "Deep Petrol" design-system name).
- Layout: centered/stacked, tall (`py-16`, large heading+subtext+rating+2 lines+buttons stacked) → compact, horizontal on desktop (text left, 2 buttons right, `py-12`), still stacks cleanly on mobile.
- Typography: `.font-display` heading now renders in Plus Jakarta Sans (bold, `text-2xl`) instead of the old serif at `text-3xl`.
- Accent: `text-gold-light` eyebrow (resolves to aqua-light, the current theme) — used once, not overused, exactly per "dezent eingesetzte Aqua-Akzente."
- Data: same `reviewPlatforms.google` rating/count used everywhere else on the site — **no new or embellished claim added** (a draft that added the word "verifizierte" to the copy was caught and reverted before shipping — the underlying data is the same single source of truth every other review surface reads from, which *is* the real meaning of "authentisch/verifiziert" here: one real number, not a new unverified claim in the UI text).
- Buttons: `variant="primary"` (aqua) + `variant="outline"` (white-bordered, correct contrast on the dark bg) — both clearly visible, same links as before (`writeReviewUrl`, `url`), nothing broken.

## P1 — Premium Footer Redesign

**Status: FIXED.** `Footer.tsx`:
- **Real bug found and fixed:** `hover:text-gold-light-light` on the emergency-number link — not a valid Tailwind class (typo), meant the 144 link had no hover state at all. Fixed to `hover:text-white` with `transition-colors`.
- Structure confirmed/kept exactly as requested: (1) logo + tagline + contact, (2) Schnellzugriff, (3) Patienteninfo, (4) Rechtliches + Social — already correct from the prior milestone, re-verified.
- **Dezente Trennlinien added:** `lg:divide-x lg:divide-white/10` between the 4 column groups (desktop only — a vertical divider would be meaningless once columns stack on mobile).
- **Spacing reduced:** section padding `py-16`→`py-14`, grid gap `gap-12`→`gap-10` — tightened without cramming.
- **Hover states made "professional":** every footer link (17 instances) now has `transition-colors` added alongside its existing `hover:text-white` — the color change is now smooth, not an abrupt snap.
- **Closing area improved:** the emergency notice and the copyright line were two separately-spaced blocks (`mt-12`, then another `mt-6` with its own border) — merged into one row (notice left, copyright right on desktop, stacked centered on mobile) under a single top divider, reducing the redundant stacked whitespace you flagged. The emergency text itself (phone number 144, wording) is **unchanged** — "fachlich korrekt" was never at risk since no wording was touched, only the layout around it.
- Cookie-Einstellungen remains a direct link in the Rechtliches column (unchanged, already there, already working).

## P1 — Floating Elements

| Element | Check | Result |
|---|---|---|
| Floating call button (`FloatingCTA`) vs. Cookie banner | Bounding-box check on first page load (390px): FAB at y:780–828, banner at y:595–844 — FAB is fully behind the banner (z-40 < z-60), **not** visible/clickable until the banner is dismissed | Correct, intentional — confirmed visually, no clutter (screenshot: `floating-elements-initial.png`) |
| Floating call button vs. Reviews quote card | Regression-guarded by `tests/responsive.spec.ts`'s overlap test (added in the previous pass after finding and fixing this exact class of bug) | Still passing, re-verified |
| Sticky header vs. everything else | Covered above (P0) | Fixed |
| Sanity-driven announcements (`AktuellesNavMenu`) | Renders inside the normal header nav flow, not an independent floating element — no separate z-index/positioning of its own to conflict with anything | No issue found |
| Mobile navigation (hamburger menu) | Opens as a normal in-flow dropdown below the header (not an overlay with its own z-index), confirmed no interaction with the FAB or cookie banner | No issue found |
| Next.js Dev Indicator (the small circular "N" badge) | **Development-mode only**, built into Next.js itself, automatically absent from the production static export (`out/`) — confirmed by inspecting `out/de/index.html`: no dev-indicator script/element present in the built output. Nothing to fix; it is correctly never production UI. | PASS (by design, not by any change made) |

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 0 errors |
| Full Playwright suite | 126/126 pass |
| Screenshots, all 5 required widths | `docs/design/screenshots/premium-footer-qa/google-footer-{1440,1024,768,390,320}.png` |
