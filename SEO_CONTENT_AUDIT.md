# SEO Content Audit — Leistungen Pages

**Date:** 2026-11-22. Scope: all 7 service detail pages (`src/content/seo-services.ts`, rendered via `ServiceLanding.tsx`). Per the explicit constraint — **no invented medical content, no new medical claim shipped without being flagged for doctor sign-off.**

## Reviewed, per page: professional explanation quality, patient-friendly headings, FAQs, internal links, CTAs, structured data

| Page | Fachliche Erklärung | Patientenfreundliche Überschriften | FAQ | CTAs | JSON-LD |
|---|---|---|---|---|---|
| `allgemeine-hno` | Clear, accurate, appropriately scoped (symptoms/treatments lists) | Yes — "Symptome"/"Behandlungen" | 1 question | Phone + Termin | Present (service page schema, re-confirmed valid in `TECHNICAL_SEO_FINAL.md`) |
| `kinder-hno` | Same quality, age-appropriate framing | Yes | 1 question | Phone + Termin | Present |
| `allergologie` | Same quality | Yes | **0 — empty array** | Phone + Termin | Present |
| `hoertest` | Same quality | Yes | **0 — empty array** | Phone + Termin | Present |
| `schwindel` | Same quality | Yes | **0 — empty array** | Phone + Termin | Present |
| `schnarchen` | Same quality | Yes | **0 — empty array** | Phone + Termin | Present |
| `stimmstoerungen` | Same quality | Yes | **0 — empty array** | Phone + Termin | Present |

## FIXED — internal linking (the one gap safe to close without new medical content)

**Found:** `ServiceLanding.tsx` had exactly 2 outbound links (phone, `/termin`) and **zero** internal links to other services or back to the `/leistungen` overview — every service page was a dead end for a visitor who landed on the "wrong" one or wanted to browse. This is a pure navigation/structure issue, not a content question, so it was fixed directly:

Added a "Weitere Leistungen" / "Diğer hizmetlerimiz" block at the bottom of every service page — links to 3 of the other 6 real services (using the exact same titles already shown in `ServicesPreview` on the homepage, via `serviceSlugToKey`/the `services` translation namespace — no new copy) plus a link back to `/leistungen`. No invented service, no new claim — just real existing pages, now reachable from each other.

## OPEN / NEEDS_APPROVAL — 5 of 7 pages have no FAQ

`allergologie`, `hoertest`, `schwindel`, `schnarchen`, `stimmstoerungen` all have `faq: []` in `seo-services.ts`. FAQs genuinely help both patients (answers common pre-visit questions) and SEO (FAQPage structured-data eligibility, like the 2 pages that already have one question each). **Not written here** — a real FAQ answer is a medical statement (e.g. "how long does a hearing test take," "is a referral needed for an allergy test," "how is vertigo diagnosed") and per your explicit rule, any new medical-adjacent claim needs doctor sign-off before publishing, not an invented draft from this session. 

**Proposed topics only** (questions, not answers — for the doctor to review and answer in their own words):
- `allergologie`: "Brauche ich eine Überweisung für den Allergietest?" / "Wie lange dauert ein Pricktest?"
- `hoertest`: "Tut ein Hörtest weh?" / "Ab welchem Alter ist ein Hörtest bei Kindern sinnvoll?"
- `schwindel`: "Wann sollte ich bei Schwindel einen HNO-Arzt aufsuchen statt einen Neurologen?"
- `schnarchen`: "Ist Schnarchen immer behandlungsbedürftig?"
- `stimmstoerungen`: "Wie lange dauert die Abklärung einer Heiserkeit?"

These are **question topics derived from each page's own existing symptom/treatment lists** (not invented new subject matter) — the answers still need the doctor.

## DE/TR quality parity

Both locales reviewed for all 7 pages (title, intro, symptoms, treatments, keywords) — structurally identical content depth in both languages, same 2-pages-with-FAQ / 5-pages-without split in both locales (confirmed via the raw data already read in this pass — no locale-specific gap beyond the shared one above).

## Verification

`npx tsc --noEmit`: 0 errors. `npm run build`: 0 errors. Full Playwright suite: 130/130 pass (includes the 2 new SEO regression tests from `TECHNICAL_SEO_FINAL.md`). Screenshot of the new internal-links block: `docs/design/screenshots/premium-footer-qa/service-internal-links.png`.
