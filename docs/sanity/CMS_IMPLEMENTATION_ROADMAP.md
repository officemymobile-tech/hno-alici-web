# CMS Implementation Roadmap — Dr. Alici Website

**⚠️ Superseded by the 2026-11-22 implementation pass.** Items 1–13 and 16–18 below were implemented — see `SANITY_100_PERCENT_COVERAGE_REPORT.md` for exactly what changed and how it was verified. Item 14 (service-copy drift) needed a correction mid-implementation: the plan below assumed reusing `h1`, but that field includes the location suffix ("Wien 1100") which reads wrong in a menu — a new, separate `service.shortTitle` field was added instead, pre-seeded with the real existing short text. Still open: items involving new real content for the 3 new document types (needs a Sanity token — see the completion report), and the image-hotspot frontend wiring (schema done, not yet consumed by any component). Kept below in its original, pre-implementation form for reference.

---

Documentation only at the time of writing — this is the original, pre-implementation plan. Ordered by the P0/P1/P2 priorities from `CMS_GAP_ANALYSIS.md`. Each item names the schema/code change that *would* be needed, not a finished solution.

## Phase A — P0 fixes (blocking "full Sanity management" as a goal)

1. **Unify service copy across homepage/mega-menu/detail page.** Either (a) make `ServicesPreview.tsx`/`ServicesMegaMenu.tsx` read `seoServices[slug].h1`/`.intro` (the already-Sanity-connected object) instead of `messages.services.*`, retiring the separate translation keys, or (b) keep both but add a visible Studio-side warning that the short label is separate from the detail-page content. Option (a) is the only one that actually closes the gap. **Dependency:** requires checking whether the Sanity `h1`/`intro` text is short enough to reuse as a card blurb, or whether a new, shorter dedicated field (e.g., `service.shortTitle`) should be added to the schema first.

2. **Add real schema coverage for the 2nd/3rd doctor**, or explicitly scope the homepage "Doctors Section" down to showing only the 1 migrated `doctor` document (a content decision, not just technical) if Dr. Meier/Dr. Benjamin Alici's details are not meant to be independently editable. **Dependency:** a decision from the practice on whether these 2 are meant to be full CMS entries or intentionally secondary/static.

3. **Design a `review`/`rating` document type** (per platform: name, rating, review count, URL; per individual review: author, text, date, source, language) and migrate the current `reviews.ts` content into it. **Risk:** this is real, legally-sensitive content (patient testimonials, third-party platform ratings) — migration must preserve exact wording/attribution, same caution as the legal-document migration that already happened for Impressum/Datenschutz.

4. **Design a `landingPage` document type** (or extend `service`-like pattern) for the 4 locale-exclusive SEO pages, mirroring the fields `SeoLandingTemplate.tsx` actually consumes. **Dependency:** these pages have a cross-locale slug-swap pattern (de-page ↔ different tr-page) already handled in `sitemap.ts`/hreflang code from an earlier session round — any new schema must preserve that pairing, not just add a flat slug list like `service` has.

5. **Route `schema.ts`'s `Physician.name`/`jobTitle`/`medicalSpecialty` through `siteConfig`/the `doctor` overlay** instead of hardcoded literals. Low-risk, mechanical change — the data already exists in the `doctor` document (`name`, `tagline`); only `medicalSpecialty` (an array of Otolaryngology/Pediatric Otolaryngology/Allergy specialty codes) has no current schema field and would need one added to `doctor`.

## Phase B — P1 fixes (wire up fields that already exist)

6. Wire `Footer.tsx` to read `siteSettings.socialLinks` (array, already supports arbitrary platform/URL pairs) instead of the hardcoded `facebookUrl` constant.
7. Wire `Footer.tsx`'s logo to `siteSettings.logo` instead of the hardcoded `images.logoDrUmit` path.
8. Wire the root layout's Open Graph image to `siteSettings.seo.defaultOgImage` instead of the hardcoded `images.ordinationHero` path.
9. Route `schema.ts`'s `Physician.image`/`MedicalClinic.image` through the same `getEditableImage` calls the visible pages already use, so structured data can never silently diverge from what a visitor actually sees.
10. Decide whether the homepage FAQ should pull from `service.faq` entries (aggregated across all 7 services) instead of/in addition to the separate `patientInfo.faq.items` — or keep them intentionally distinct (general FAQ vs. service-specific FAQ is a legitimate design, not automatically a bug) and just document the distinction for editors.
11. Verify (not yet independently confirmed in this audit) whether `/leistungen/page.tsx`'s overview grid has the same `messages.services.*` vs. `seoServices` drift risk as the homepage/mega-menu — apply the same fix as item 1 if so.
12. Add `hero.badges.*` (3 trust-badge labels) to the `textOverrides` pattern, or a small dedicated array field on `siteSettings`.
13. Pre-seed `about.eyebrow` in `site-editable.json` (or document for editors how to add a `textOverrides` entry for a key that isn't pre-seeded) so the existing `getEditableText("about","eyebrow",...)` call site has a real local/Sanity value instead of silently always falling back to the next-intl default.

## Phase C — P2 (optional polish)

14. Move remaining short UI-chrome strings (CTA labels, footer column headings, about-checklist items, `/leistungen/[slug]`'s hardcoded subheadings) into the `textOverrides` pattern, only if editorial demand for frequent wording changes actually materializes — not recommended pre-emptively, since it adds Studio clutter for content that rarely changes.

## Cross-cutting dependencies and risks (not phase-specific)

- **No live/draft preview exists anywhere.** Every phase above inherits this limitation — an editor will not see their change on the website until the next build runs. This is a bigger, separate architectural decision (would require a genuine server, which conflicts with the current GitHub Pages static-export hosting choice) and is out of scope for a "wire up more fields" roadmap — flagged here only so it isn't lost.
- **No publish automation is active.** Every field made newly editable in Phases A/B still requires a manual rebuild to reach the live site until the already-designed (but undeployed) webhook pipeline is activated — a separate, already-documented, already-approval-gated piece of work (see `SANITY_FINAL_INTEGRATION_REPORT.md`, Section 9).
- **Legal/medical content sign-off still applies.** Phase A item 3 (reviews) and any future `service`/`doctor` content changes carry the same "real, sensitive content — don't silently rewrite" caution already documented for legal pages.
- **Schema changes require a Studio deploy, not just a code change**, and any new required field could affect the 9 already-migrated `staffMember`/`service`/etc. documents if validation rules are added — each Phase A/B schema addition should default to optional/non-required to avoid breaking already-published content.
- **None of Phase A/B closes the "zero Codeänderung" goal completely** — Header nav labels and the appointment form are correctly excluded by design (see Gap Analysis), so "100% CMS coverage" is not actually the right target; a more honest target is "100% of genuinely redactional content," which this roadmap's Phase A+B would reach.
