# Local SEO Wien — Coverage Audit + Content Plan

**Date:** 2026-11-22. Per the binding constraint carried over from the design-modernization plan ("keine künstlichen SEO-Landingpages", "keine erfundenen ... Leistungen", medical statements need doctor sign-off before publish): this is an **audit of existing keyword coverage** against the real, already-published pages, plus a short list of **proposed** (not applied) copy tightenings — mirroring the Phase 3 "proposed corrections, not applied" pattern.

## Keyword → real page mapping

| Keyword | Covered by | Status |
|---|---|---|
| HNO Arzt 1100 Wien / HNO Arzt Wien Favoriten | Homepage (`hero.eyebrow`: "HNO in Wien Favoriten"), `src/lib/site.ts` address (1100 Wien) in every page's local-business JSON-LD | **Covered** |
| Türkischer HNO Arzt Wien | `/de/tuerkischer-hno-arzt-wien` ↔ `/tr/turk-kbb-doktoru-wien` (locale-exclusive pair, hreflang-correct per Phase 2/3 fix) | **Covered** |
| Kinder HNO Wien | `/de/kinder-hno-wien-1100` ↔ `/tr/cocuk-kbb-wien-1100`, plus `/leistungen/kinder-hno` (general service page) | **Covered** |
| Hörtest Wien | `/leistungen/hoertest` (`src/content/seo-services.ts`) | **Covered**, page exists and is real content — not re-audited line-by-line in this pass (no evidence of a problem found) |
| Allergietest Wien | `/leistungen/allergologie` **and** the existing blog post `/blog/allergietest-wien` (double coverage, good for topical depth) | **Covered** |

No gap required a new page. The existing page set already matches the named keyword list from the original brief — this audit found **no missing category**, so no new landing page is proposed (consistent with "keine künstlichen SEO-Landingpages").

## Google Business Profile / local directories

Documentation only, as scoped — **no external account was touched**. `src/content/reviews.ts` already carries the current Google (4.0★/70), DocFinder (4.2★/13) and Herold (4.9★/2) numbers, same ones flagged in the Phase 2 audit (Finding E) as **needing a human check against the live listings before the next deploy** — still unresolved, still flagged, not fabricated or silently updated here.

## Proposed, not-applied content observations (flag for doctor/practice sign-off)

These are observations, not changes — nothing below was written into any content file:

1. The homepage hero's eyebrow text ("HNO in Wien Favoriten") is the only place "Favoriten" (the district name) appears above the fold — consider whether the Hero's `tagline` ("Moderne HNO-Medizin in Wien Favoriten") should also appear in the page `<title>` for pages where it currently doesn't, for consistency. Not changed here — a title-wording decision, not a technical bug.
2. `leistungen-overview-pro.jpg` (the `/leistungen` overview hero image) and the two locale-exclusive landing pages' imagery are the same clinic photos used elsewhere — intentional reuse per the existing "no invented photography" rule, not a defect.

## Explicitly not done

- No new SEO landing page created.
- No medical claim added or altered anywhere (`src/content/seo-services.ts`, `seo-landings.ts` untouched).
- No change to any third-party listing (Google Business Profile, DocFinder, Herold).
