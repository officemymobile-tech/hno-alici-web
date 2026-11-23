# CMS Gap Analysis — Dr. Alici Website

**⚠️ Superseded, now twice over.** This file is kept as the original, pre-implementation audit record. Round 1 (2026-11-22) fixed 21 of the 23 gaps below — see `SANITY_100_PERCENT_COVERAGE_REPORT.md`. Round 2 (2026-11-23) wired the image-hotspot frontend consumption that Round 1 had left open, found and fixed 4 more previously-unaudited homepage text elements, prepared (but did not execute) an idempotent migration plan for the 3 new document types' real content, and found 1 new genuine gap (4 hardcoded homepage preview-card images). Current coverage: **48/53 (90.6%)**, or **48/51 = 94.1%** excluding the 2 by-design technical elements — see `SANITY_FINAL_PRODUCTION_READINESS_REPORT.md` for the full current picture, including what's still blocked on a permission (not a code gap) and what's genuinely still open.

---

Based on the 45-row `CMS_COVERAGE_MATRIX.md`/`.csv`, read-only audit, 2026-11-22 (original, pre-implementation version below). Every finding below cites the exact file/field checked — nothing here is inferred without a direct code read.

## Methodology (how the numbers below are counted, not invented)

Of the 45 audited content elements: **19 fully editable in Sanity and connected to the frontend** (YES), **1 partially editable** (`about.eyebrow` — technically overridable via Sanity's free-form `textOverrides`, but not pre-seeded), **25 not editable via Sanity**. Of those 25, **2 are deliberately technical/protected** (Header nav item labels, the `AppointmentForm`'s `mailto:`-only logic) and should stay in code — they are not redactional content. That leaves **23 genuine redactional gaps**.

**Coverage percentage (at the time of this audit, before the implementation pass):** 19 fully-editable / 45 total audited elements = **42%**. If the 2 technical-by-design elements are excluded from the denominator (since they were never meant to be CMS-managed): 19 / 43 = **44%**. Neither number is rounded up or guessed — both are a direct count from the matrix.

## P0 — Critical (central content not manageable, or contradictory)

1. **Homepage/mega-menu service copy is a 3rd, independent content source from the Studio-edited service detail pages.** `ServicesPreview.tsx` and `ServicesMegaMenu.tsx` both read `messages/*.json`'s `services.*.title/text`, completely separate from the `service` document's `h1`/`intro` fields that `ServiceLanding.tsx` actually uses. An editor changing a service in Studio today would see the detail page update but the homepage card and mega-menu silently keep showing the old wording — a real, likely-to-happen content contradiction, not a hypothetical one. *(`ServicesPreview.tsx:22`, `ServiceLanding.tsx:24`)*

2. **The homepage "Doctors Section" (3 doctors) is fully hardcoded; the Sanity `doctor` schema only has 1 of them migrated.** Dr. Sigrid Meier and Dr. Benjamin Alici cannot be added, edited, or removed via Studio at all — only Dr. Ümit Alici's data has a real document. *(`src/content/site-content.ts:21-35`)*

3. **Patient reviews and platform ratings (Google/DocFinder/Herold — real, sensitive data) have no Sanity schema whatsoever.** `src/content/reviews.ts` is a hardcoded TS file used on the homepage, `/bewertungen`, and in `schema.ts`'s JSON-LD `aggregateRating`. Any real rating change (which will happen — ratings move over time) requires a code change and redeploy, not a Studio edit. *(`src/content/reviews.ts`)*

4. **The 4 locale-exclusive SEO landing pages are 100% outside Sanity.** `seo-landings.ts`'s `seoLandings` object has no `isSanityContentEnabled()` branch at all — confirmed by direct comparison with the same file's `blogPosts` export, which does have one. These are real, indexed, live pages (`/tuerkischer-hno-arzt-wien`, `/turk-kbb-doktoru-wien`, `/kinder-hno-wien-1100`, `/cocuk-kbb-wien-1100`) with zero CMS path for their title/meta description/keywords/body copy. *(`src/content/seo-landings.ts:7-123`)*

5. **Structured data (`Physician.name`, `jobTitle`, `medicalSpecialty`) is hardcoded directly in `schema.ts`, not read from `siteConfig`/the `doctor` overlay.** A name or specialty change made in Sanity would never reach Google's structured data. *(`src/lib/schema.ts:46-48`)*

## P1 — Important (partially editable, or a real Sanity field is unused)

1. **`siteSettings.socialLinks` schema field exists and is never read.** `Footer.tsx` uses a single hardcoded `facebookUrl` constant instead. *(`Footer.tsx:5`, `src/content/site-content.ts:31`)*
2. **`siteSettings.logo` schema field exists and is never read.** Footer imports a hardcoded logo path (`images.logoDrUmit`) directly.
3. **`siteSettings.seo.defaultOgImage` schema field exists and is never read.** The root layout hardcodes `images.ordinationHero` as the Open Graph image for every page.
4. **`Physician.image`/`MedicalClinic.image` in structured data reference hardcoded file paths**, not the `getEditableImage`-resolved (Sanity-overridable) portrait/hero photo the visible page actually shows — these can silently diverge after a photo edit.
5. **Homepage FAQ (`FaqSection.tsx`) and the `service.faq` schema field are two unrelated FAQ sources.** The schema's `faq` array is real and connected — but only on service detail pages, never on the homepage.
6. **Hero trust badges** (3 short labels) have no Sanity connection — a likely-to-be-requested small edit with no current path.
7. **`leistungen/page.tsx`'s overview grid** appears to use the same `messages.services.*` short text as the homepage preview, not the Studio-edited `h1`/`intro` — needs the same drift-risk fix as Finding P0-1 (verify exact source before any fix; flagged here as it wasn't independently re-confirmed beyond the homepage/mega-menu pair).
8. **Simple pages' `generateMetadata()` (team, kontakt, leistungen-overview, patienteninfo, bewertungen, termin, all 4 legal pages, the doctor-profile page tree)** have correct, bug-fixed titles/descriptions from an earlier session round — but they live in code, not Studio. Lower urgency than the P0 items since they're currently correct, just not editor-accessible.
9. **`about.eyebrow` overlay key** is called by `AboutPreview.tsx` but not pre-seeded in `site-editable.json` — works only if an editor manually adds that exact `section`/`key` pair via Studio's free-form `textOverrides` array, which nothing currently documents to them.

## P2 — Improvement (comfort, optional, low editorial frequency)

- CTA button labels, footer column headings, about-section checklist, patient-info static text, `/leistungen/[slug]`'s hardcoded "Symptome"/"Behandlungen" subheadings — all short, low-change-frequency UI chrome. Technically could be moved to `textOverrides`, but genuinely lower priority than the P0/P1 items above.
- Header nav item labels and the `AppointmentForm`'s structure are correctly **excluded from CMS scope by design** (routing safety / the form has no server-side content to manage) — not gaps, documented here only for completeness per the audit's own "technical vs. redactional" distinction.

## Risk categories, as requested

- **Hardcoded content with real editorial weight:** reviews/ratings, 2 of 3 doctors, 4 SEO landing pages, homepage/mega-menu service copy.
- **Unused Sanity fields:** `socialLinks`, `logo`, `seo.defaultOgImage` on `siteSettings`; `doctor.name`/`tagline` not read by `schema.ts`.
- **Missing schemas:** no `review`/`rating` document type; no schema for the 4 SEO landing pages; no schema covering more than 1 `doctor`.
- **Missing GROQ fields:** none found — every existing schema field that IS consumed has a corresponding query field; the gaps are entirely "field exists but nothing queries/renders it," not malformed queries.
- **Not-connected components:** `ServicesPreview.tsx`, `ServicesMegaMenu.tsx`, `FaqSection.tsx` (homepage), `Footer.tsx`'s logo/social block, `DoctorsSection.tsx` (names/titles), `schema.ts` (several fields).
- **Duplicate content sources:** `teamStaff` array in `site-content.ts` vs. the Sanity-overlaid team list in `site-editable.json`/Studio (the former is only used as the fallback default, not a live duplicate — low risk, but worth knowing it exists) — confirmed non-conflicting since `getEditableTeamStaff(teamStaff)` only returns the local array when the Sanity overlay is empty.
- **Non-editable images:** footer logo, Open Graph default image, structured-data photo references, the 2 service-detail-only photo constants (`leistungenFoto09/10` — note: these ARE replaced by Sanity's `service.image` on detail pages per-service, but the raw constants still exist in code as what the local fallback uses).
- **DE/TR mapping errors:** none found that are actually wrong — the one real gap is coverage, not mis-mapping: several `reviewPlatforms`/review entries are DE-only by nature of the source platform (DocFinder reviews are often submitted in German only), which is a data-reality limitation, not a code bug.
- **Incomplete preview:** total — there is no live/draft preview mechanism anywhere in this project (confirmed in an earlier session round and re-confirmed here); every content source is pulled once at build time.
- **Missing publish automation:** confirmed, unchanged from earlier reports — `workers/sanity-rebuild-webhook.js` exists, is correctly designed (HMAC-verified, scoped tokens), but is not deployed and no webhook is registered in Sanity.
