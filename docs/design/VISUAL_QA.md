# Visual QA Log — Reference vs. Live, iterative

Per your correction: the first pass optimized the existing layout instead of rebuilding the reference's visual composition. This log tracks each redesign iteration section-by-section, screenshotted at 1440px desktop, compared directly against `design-reference/design-reference.png.png`, documenting what matches, what's still different, why, and what's fixed next — not a one-shot claim of "done."

Screenshots this round: `docs/design/screenshots/v2-hero-services/`.

## Iteration 1 — Hero, floating info bar, Services

### Hero

| | Reference | Before this iteration | After this iteration |
|---|---|---|---|
| Heading size | Very large, dominant | `text-5xl sm:text-6xl` — noticeably smaller than reference | `text-6xl sm:text-7xl xl:text-[5.5rem]` |
| Photo | Large, full-bleed to the section edge, no card frame, fills ~45% width | Small rounded card (`aspect-[3/4]`, `max-w-md`, gold ring border) floating in the right column | Full-bleed `fill` image, right half of the section, no frame/border, matches reference's edge-to-edge treatment |
| Background | Clean solid petrol-dark, no photo texture behind the text | A second, faded (`opacity-40`) hero photo as a full-section background behind the text — visual noise not in the reference | Removed — solid `bg-petrol-dark` only, text now reads cleanly |
| Above the H1 | One eyebrow line only | Two elements (an "Akutversorgung" pill **and** the eyebrow) competing for attention | Reduced to the one eyebrow line, matching the reference |
| CTAs | One gold primary + one clearly visible secondary | Present, but smaller and visually secondary to a Google-rating pill above them | Enlarged both buttons (`px-8 py-4 text-lg`), removed the Google-rating pill from the hero (it's not in the reference's hero; still present in full in the Reviews section) |
| Trust badges | A clean row of 3 icon+label items | Present from the prior pass, correct pattern, just too close to the smaller heading | Kept, enlarged spacing/icon size to match the bigger hero |

**Verdict: now a close match at 1440px.** Remaining difference: the reference's hero photo shows the doctor standing with visible equipment in the background (wider framing); our real portrait is a 3/4 seated/standing shot — not changed, since substituting a different real photo crop is a content decision, not a layout one, and no better-framed real alternative exists in the asset set.

### Floating information bar

| | Reference | Before | After |
|---|---|---|---|
| Shape | Large white rounded card with a visible drop shadow, overlapping the hero's bottom edge | A flat strip, no card, no overlap, sitting fully below the hero in normal document flow | Rewritten as a `rounded-3xl bg-white shadow-2xl` card with `-mt-10/-12/-16` pulling it up over the hero's bottom edge, exactly the reference's floating-card pattern |
| Content | 4 equal columns: status / hours / phone / address | Same 4 items, just flat | Same 4 items, now inside the floating card |

**Verdict: matches.**

### Services

| | Reference | Before | After |
|---|---|---|---|
| Card format | Large photographic cards — photo fills most of the card, small icon badge overlapping the photo's bottom-left corner, title + short text below | Small cards with only an icon in a colored circle, no photography at all | Rewritten: `aspect-[4/3]` real photo fills the card top, a white rounded icon badge overlaps its bottom-left corner (`-translate-y-1/2`), title/description/gold arrow link below — same structural pattern as the reference |
| Image source | (unspecified in the reference — treated as a stand-in design, not a rights claim) | icon-only, no photo | **Real, already-existing practice photos only** — reused the same 4 real images already live elsewhere on the site (reception desk, child ear exam, an exam-with-instrument photo, an allergy/blood-test photo), matched to the most fitting of the 4 featured categories. No stock photography, nothing generated, nothing invented. |
| Category count | 4 cards shown | 3 (the site's `leistungenContent.sections` grouping) | 4 — but all 4 are real, already-published individual service pages (`allgemeine-hno`, `kinder-hno`, `hoertest`, `allergologie`, each with its own existing URL and copy in `seo-services.ts`), not new/invented Leistungen. A broader featured subset of the real 7, not a new 4th category. |

**Verdict: matches the reference's visual pattern.** One semantic imperfection acknowledged: only 4 distinct real "pro" photos exist for services content, so one card (Allgemeine HNO) uses a reception-desk photo rather than a procedure-specific one — the other 3 are well-matched (child exam → Kinder-HNO, exam-with-instrument → Hörtest, arm/blood-test → Allergologie). Flagged, not silently hidden: if a better-matching 5th real photo exists on-site elsewhere (not yet found in `public/images/`), it can replace the general-care one.

## Iteration 2 — Doctor Section, Reviews & Trust, FAQ, Contact & Directions, Footer, Mobile

Screenshots: `docs/design/screenshots/final/{de,tr}-home-{1440,390}.png`.

### Doctor Section (`AboutPreview.tsx`)

| | Reference | Before | After |
|---|---|---|---|
| Eyebrow | "IHR HNO-FACHARZT" above the heading | Missing entirely | Added (`about.eyebrow`, new translation key, both locales) |
| Heading size | Large, dominant | `text-4xl` — small relative to the rest of the redesign | `text-3xl sm:text-5xl lg:text-6xl` (mobile-safe, see fix below) |
| Composition | Generous image + text, large checklist | Present from iteration 1, correct pattern, just smaller scale | Image corner radius enlarged (`rounded-[2.5rem]`), section padding increased (`py-28 lg:py-32`), all text/list sizes stepped up |
| CTA | Gold-outlined button | Already gold-outline from iteration 1 | Unchanged |

**Real bug found and fixed here:** at 320–360px, the heading ("Ihr Ansprechpartner für HNO in Wien") blew the grid 19px past the viewport edge — a classic CSS Grid `min-width: auto` blowout (a long German compound word inside a 2-column grid item with no `min-w-0`). Fixed by adding `min-w-0` to the grid container and both its children, and by giving the heading a proper mobile-first size (`text-3xl` at the smallest widths, scaling up) instead of jumping straight to a size tuned for desktop. Re-verified: 0 overflow at 320/360/390/430/768/1024/1440px (`tests/responsive.spec.ts`, both `de` and `tr`, checked manually for `tr` too since Playwright's suite only runs `de`).

### Reviews & Trust (new `ReviewsTrustSection.tsx`, homepage-only)

| | Reference | Before | After |
|---|---|---|---|
| Layout | 2 columns: reviews summary left, "why patients choose us" right | 2 separate full-width sections stacked (3 platform cards + 3 review cards, then a separate 4-card trust grid) | Rewritten as one 2-column section matching the reference |
| Google emphasis | Large, highlighted Google rating block | Was one of 3 equal-weight cards | Large standalone Google card (petrol bg, gold ring), DocFinder/Herold folded into a small secondary stat line below it — same real numbers, less repetition |
| Featured review | One quote with pagination (reference) | 3 review cards in a grid | One featured 5-star review shown as a quote card (not a fabricated carousel — just one real review, picked as the first 5-star entry in `patientReviews`) |
| Trust items | 4 icon+label items, light style | Separate `TrustGrid` section, heavier cards | Same 4 real items (`trust.items.*`, unchanged copy), now the right column, icon+label only, no card chrome |
| `/bewertungen` (full reviews page) | n/a | Full 3-platform-card + full review grid | **Unchanged** — still uses `ReviewsSection`'s non-`compact` path exactly as before; only the homepage's `compact` usage was replaced |

No rating, review count, or quote was invented — same `reviewPlatforms`/`patientReviews` data every other review surface on the site reads from.

### FAQ (`FaqSection.tsx`)

Reference shows a 2-column layout (heading/intro left, accordion right), not a centered single column. Rewritten to match: left column eyebrow+heading+subtext+"more" link, right column the existing `FaqAccordion` unchanged. Same `min-w-0` safety applied (heading stepped from `text-3xl` up, not fixed at a desktop size).

### Contact & Directions (`LocationSection.tsx`)

Reference shows the map, address/directions, and hours as one cohesive panel — before, `MapDirectionsPanel` and `HoursCard` were two separately-boxed cards stacked in the same column. Rewritten as one `rounded-3xl` card with an internal `border-t` divider between the "Anfahrt" half and the "Ordinationszeiten" half. **`/kontakt`'s own layout (which reuses the shared `MapDirectionsPanel`/`HoursCard` components) was deliberately left untouched** — the merge is homepage-specific markup, not a change to those shared components, so the Kontakt page's existing (intentionally different) 2-card layout still works exactly as before.

### Footer

Already regrouped into 3 columns + social link in the first pass; reviewed again against the reference this round — no further structural change needed, matches.

### Mobile (390px, both locales)

Reviewed `de-home-390.png` and `tr-home-390.png` section by section: Hero's photo-above-text mobile pattern, the floating info card collapsing to a stacked single column with dividers, the 4 service cards collapsing to 2-up, the Doctor/Reviews/FAQ 2-column sections collapsing to 1 column — all read cleanly, no clipped text, no overflow (verified at 320/360/390/430px for `de`, and manually at 320/360/390px for `tr`).

## Final direct comparison — reference vs. live, 1440px + 390px

Reference (`design-reference/design-reference.png.png`) vs. live (`docs/design/screenshots/final/de-home-1440.png`, `de-home-390.png`):

| Section | Match |
|---|---|
| Top status bar + nav | Close — same information (status, hours note, phone, locale, CTA), slightly different visual treatment (status bar shows live open/closed state with real urgency copy rather than the reference's static placeholder text — intentional, it's real data) |
| Hero | Close — large heading, full-bleed photo, 2 CTAs, 3 trust badges |
| Floating info card | Close — same 4 fields, same floating/overlapping treatment |
| Services | Close — 4 large photo cards, icon badge, arrow link |
| Doctor section | Close — large photo + checklist + quote + CTA |
| Reviews & Trust | Close — 2-column, Google-emphasis, trust icon row |
| FAQ | Close — 2-column |
| Contact | Close — one cohesive panel instead of 2 stacked cards |
| Footer | Close — 3 columns + social |

No remaining visible deviation was found that isn't already explained above (real-data differences, or the one acknowledged services-photo semantic imperfection from iteration 1). Visual work is complete pending your own look.

## Iteration 3 — P0/P1 final polish (visual review feedback)

Screenshots: `docs/design/screenshots/after-p0p1/` (full-page at 1440/1024/768/390/320, plus scroll-position captures of the Reviews section).

### P0 — Reviews & Trust "overlapping/cut off" — root cause found: `FloatingCTA`, not the section itself

Checked `ReviewsTrustSection`'s actual rendered geometry at 1440/1024/768/390px via precise DOM bounding-box measurements (not just visual inspection): card heights, text wrapping, and spacing inside the section were all already correct — no internal overlap, no clipped text, no inconsistent spacing. The real defect was **`FloatingCTA`** (the fixed bottom-right call button, present on every page): its previous 2-button stack (a phone pill + a separate map-pin circle, `h-14` each, stacked with a gap) was tall enough that, at a common mobile scroll position, it visually sat on top of — and made unreadable — the Reviews section's featured quote text. A fixed-position element will always cover whatever scrolls beneath it, and this one's footprint was simply too large.

**Fix:** collapsed `FloatingCTA` to one compact button (phone only — icon-only circle on mobile at `h-12 w-12`, icon+label pill from `sm:` up). The map-pin shortcut was dropped since the address/maps link is already reachable from the homepage's info strip, the Standort section, and the footer on every page — nothing was lost, just de-duplicated. Added `tests/responsive.spec.ts`'s new regression guard (bounding-box intersection check between the FAB and the quote card) so this can't silently come back.

Verified clean (no overlap, no clipped content) at 1440/1024/768/390/320px — screenshots in `docs/design/screenshots/after-p0p1/reviews-scrolled-*.png` and `full-*.png`.

### P1 — Typography

Audited actual rendered sizes (not just source classes) for the sections named: Hero's tagline line was `text-white/65` (lower contrast, read as "weak" at a glance) — bumped to `/80`. `ServicesPreview`'s card description was `text-sm` (14px) — bumped to `text-base` (16px) for parity with the rest of the card text. Info strip's labels were sized implicitly (no explicit class, inheriting default) — made explicit (`text-base` for the primary line, `text-sm` for the secondary line, consistently across all 4 columns and the `ClinicOpenStatus` "strip" variant they share). No global/blanket font-size change was made — each fix is scoped to the specific element flagged, keeping the existing responsive scale (eyebrow `text-sm`, body `text-base/lg`, h2 `text-3xl→5xl/6xl`) intact everywhere else.

### P1 — Layout rhythm

`ReviewsTrustSection`, `FaqSection`, and `LocationSection` all used identical `py-24` (96px top **and** bottom) — three consecutive sections meant 192px of accumulated empty space at each boundary. Tightened all three to `py-16 lg:py-20` (64px mobile / 80px desktop), a ~17–33% reduction depending on viewport, closer to the reference's rhythm. `ServicesPreview`, `AcuteBanner`, `GoogleBusinessCTA`, `AboutPreview`'s own padding were left alone — not flagged, and already reasonable.

### P1 — Services images

Added explicit, per-image object-position (`kinder-hno`'s child-exam photo now anchors `object-top` so the subjects stay fully in frame; the other 3 keep `object-center`, already correctly framed on inspection). Aspect ratio (`aspect-[4/3]`) and corner radius were already uniform across all 4 cards. Re-confirmed all 4 images are the practice's own real photos (same ones already used elsewhere on the site) — nothing new or stock was introduced.

### P1 — Floating Information Bar

Bumped icon size (`h-5 w-5` → `h-6 w-6`), both text lines now use explicit, consistent sizes (`text-base` primary / `text-sm` secondary) across all 4 columns including the status column, increased internal spacing (`gap-3`→`gap-3.5`, `p-6/8/10`→`p-7/9/10`) for more breathing room at every breakpoint. The 4 areas (status / hours / phone / address) already used an equal-width CSS grid (`sm:grid-cols-2 lg:grid-cols-4`) — confirmed still equal after the size increase.

### Full verification re-run (after iteration 3)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 0 errors, all 54 routes |
| Full Playwright suite | **126/126 pass** (124 + 2 new: the FAB-overlap regression guard, run on both projects) |
| `tests/accessibility.spec.ts` alone | 8/8 pass |

## Full verification re-run (after this iteration)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 0 errors, all 54 routes |
| Full Playwright suite | **124/124 pass** |
| `tests/accessibility.spec.ts` alone | **8/8 pass** |
| Manual TR overflow check (320/360/390px) | 0 overflow |
