# Local SEO Wien — Final (Search Intent, Competitors, Keyword Map, NAP)

**Date:** 2026-11-22. Internet access was available this session (`WebSearch`) — used for all 7 target keywords, real results, sources cited below. This builds on, and does not duplicate, the earlier `LOCAL_SEO_REPORT.md` (same 7-keyword → page mapping, already confirmed complete there); this pass adds the actual competitor/search-intent research and a NAP check that report didn't have internet access to do.

## Keyword → search intent → target page (confirmed, unchanged from the earlier pass)

| Keyword | Real search intent (from results) | Target page | Status |
|---|---|---|---|
| HNO Arzt 1100 Wien / HNO Arzt Wien Favoriten | Mixed: directory listings (Herold) + practice-specific pages; users comparing local options by district | Homepage (hero eyebrow "HNO in Wien Favoriten") + address/schema on every page | Covered |
| HNO Facharzt Wien | Broad, high-competition — general practice pages across all districts | `/leistungen` overview + homepage | Covered |
| Türkischer HNO Arzt Wien | **Low direct competition** — no other Vienna ENT practice in the results explicitly advertised Turkish-language service | `/tuerkischer-hno-arzt-wien` ↔ `/turk-kbb-doktoru-wien` | Covered, and genuinely differentiated (see Finding 1) |
| Kinder HNO Wien | Real competitors explicitly market pediatric ENT (see Finding 2) | `/kinder-hno-wien-1100` ↔ `/cocuk-kbb-wien-1100`, `/leistungen/kinder-hno` | Covered |
| Hörtest Wien | Mostly informational (how a hearing test works) + hearing-aid retailers (Wutscher) competing for the same query, not just doctors | `/leistungen/hoertest` | Covered |
| Allergietest Wien | Informational + directory; HNO explicitly named as a standard first contact for allergy testing (not just dermatology) | `/leistungen/allergologie` | Covered |

No new page created, no doorway page, no artificial keyword repetition — same conclusion as the earlier pass, now backed by real search results instead of inference alone.

## Finding 1 — Turkish-language positioning is a genuine, low-competition differentiator

Searching "HNO Facharzt Wien türkisch sprechend" surfaced zero Vienna ENT practices explicitly advertising Turkish-language service in their listings — only generic directory pages and unrelated Turkey-based medical-tourism sites. The site's dedicated bilingual landing pages and the Hero's "türkisch- und deutschsprachiger HNO-Facharzt" positioning are not fighting entrenched competition on this specific angle — worth protecting/reinforcing, not something to water down.

## Finding 2 — A real, named competitor in the same postal code (1100 Wien)

**Univ. Doz. Dr. Sasan Hamzavi**, ENT practice at Alfred-Adler-Straße 1/9, 1100 Wien, accepting ÖGK/KFA/BVAEB/SVS/Privat — found via the Ärztekammer Wien's own practice-transfer document. This is a direct, same-district competitor for "HNO Arzt 1100 Wien" that the site should be aware of (not a reason for any content change — just the competitive reality to know). [Source: aekwien.at practice listing](https://aekwien.at/documents/263869/347455/Facharzt%20(wmd)%20f%FCr%20Hals-%2C%20Nasen-%20und%20Ohrenkrankheiten_1100%20Wien%20(19.9%20(1).2024)/f8d388c3-3142-5981-de14-a13df65a3df3).

Also found: Klinik Favoriten's own HNO department was relocated to Klinik Donaustadt as of 13.04.2024 (per an Ärztekammer document) — the public hospital ENT option for the district no longer exists locally, which, if accurate and current, modestly strengthens the case for private/Kassenordination practices like this one in the same district. [Source: aekwien.at](https://www.aekwien.at/documents/263869/411179/240404_Informationen-HNO.pdf/37990993-bf90-6d9b-60fc-bb8df83a5c89).

## Finding 3 — the practice's own existing online directory listing may be stale (flag, not fixed)

The Herold.at blog/directory result for "HNO Arzt 1100 Wien" surfaces a 2021-dated listing for "Dr. Ümit Alici, HNO Wien 1100" — the search did not surface a street address in that listing's snippet, and the underlying blog post is explicitly dated 2021. This is exactly the kind of directory-accuracy drift the Phase 2 audit already flagged as an open item (Finding E: review counts/ratings need live verification) — now with a second, independent signal pointing the same direction. **Not fixed here** — per your instruction, "Google-Business-Profile-Änderungen nur vorbereiten, nicht ohne Freigabe durchführen," and the Herold listing is a third-party directory, not something this codebase can edit directly. [Source: herold.at blog](https://www.herold.at/blog/?p=163174).

## NAP (Name, Address, Phone, Hours) consistency check

Checked the site's own `siteConfig`/`opening-hours.ts` (single source of truth, unchanged by this pass) against what the web search surfaced:

| Field | Site's value | External finding | Match? |
|---|---|---|---|
| Name | Dr. Ümit Alici | "Dr. Ümit Alici" (Herold) | Match |
| Address | Senefeldergasse 3/1, 1100 Wien | Not shown in the Herold search snippet (possibly outdated/missing on that listing — see Finding 3) | **Cannot confirm from search alone** — needs a direct look at the live Herold listing page, which needs either a `WebFetch`-capable tool (not invoked this session beyond search) or a manual check |
| Phone | +43 1 6025400 | Not surfaced in any result | Not checked |
| Hours | Mon 09:00–13:00 & 14:00–19:00, Tue/Thu/Fri 09:00–14:00, Wed 09:00–12:00 & 13:00–17:00 | Not surfaced in any result | Not checked |

**Recommendation, not executed:** a direct visit to the practice's own Google Business Profile, DocFinder listing, and Herold listing (not just a search snippet) is the only reliable way to close this out — flagged for your approval per the explicit instruction not to touch external profiles without sign-off.

## Google Business Profile — prepared, not executed

Per your instruction, **no changes were made to any external profile.** What a GBP accuracy pass would check, if approved: matching NAP against the above, matching the real split-shift hours (the same ones already fixed in the site's own JSON-LD in a prior milestone) against what Google currently shows, and confirming the review count/rating snapshot (`reviewPlatforms.ts`: Google 4.0★/70+, DocFinder 4.2★/13, Herold 4.9★/2) still matches the live listings — this exact open item has been carried, unresolved, since the original Phase 2 audit (Finding E) and remains unresolved here, same reason: needs a human with account access, not something this session can or should do unilaterally.

## Sources

- [Ärztekammer Wien — HNO practice listing, Alfred-Adler-Straße 1/9, 1100 Wien](https://aekwien.at/documents/263869/347455/Facharzt%20(wmd)%20f%FCr%20Hals-%2C%20Nasen-%20und%20Ohrenkrankheiten_1100%20Wien%20(19.9%20(1).2024)/f8d388c3-3142-5981-de14-a13df65a3df3)
- [Ärztekammer Wien — HNO information document (Klinik Favoriten → Klinik Donaustadt)](https://www.aekwien.at/documents/263869/411179/240404_Informationen-HNO.pdf/37990993-bf90-6d9b-60fc-bb8df83a5c89)
- [Herold.at — HNO-Ärzte Wien nach Bezirk (blog, 2021)](https://www.herold.at/blog/?p=163174)
- [Herold.at — Allergietest Wien](https://www.herold.at/blog/allergietest-wien)
- [MedUni Wien — HNO Pollenservice](https://hno.meduniwien.ac.at/en/our-departments/division-of-general-otolaryngology/pollenservice/)
- [Wutscher — Hörtest](https://wutscher.com/service/professioneller-hoertest-mit-beratung/)
