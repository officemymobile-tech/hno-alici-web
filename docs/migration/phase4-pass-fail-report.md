# Phase 4 — Frontend Wiring & Full Migration: PASS/FAIL Report

**Branch:** `cms/phase2-4-audit-sanity` (local only — no push, no merge, no deploy, production untouched throughout). **Sanity project:** `qhrodl8k` ("HNO Alici" org `owci0oa5h`).

## 1. Frontend integration

| Check | Result |
|---|---|
| `getEditableContent()`, `getEditableText()`, `getEditableImage()`, `getEditableTeamStaff()` wired to Sanity (`siteSettings.editableImages`/`textOverrides`, `staffMember`) with local fallback | **PASS** |
| `getActiveAnnouncement()`, `getAnnouncementForAdmin()` wired to Sanity `announcement` with local fallback | **PASS** |
| `getLegalDocument()` wired to Sanity `legalDocument`, text copied verbatim (no rewording) | **PASS** |
| `siteConfig` (contact info), `doctorProfile`, `seoServices`, `blogPosts` wired with the same pattern | **PASS** |
| Static export (`output: "export"`) preserved — no server runtime functions added | **PASS** — confirmed no `unstable_cache`/`revalidateTag`/API routes were added; all Sanity fetches run once at build-time module evaluation (top-level `await`), same mechanism Next already uses for this static export |
| GitHub Pages hosting unchanged | **PASS** — no hosting/deploy config touched |
| All existing URLs, DE/TR routes, design, SEO metadata preserved | **PASS** — see Section 3 (byte-level content diff) |
| Live "is clinic open now" ticker (`ClinicOpenStatus`, a client component with a 60s interval) | **Deliberately NOT wired to Sanity** — it needs synchronous, client-bundled data; wiring it would require either a build-time Sanity fetch injected as a prop through every call site, or a runtime client-side Sanity fetch (which would violate "no runtime server functions/client-side CMS calls" and leak build-time-only logic into the browser). Documented as an explicit, deliberate scope boundary, not an oversight. The `openingHours` Sanity document still exists and is migrated — only this one live-ticker display isn't sourced from it yet. |

## 2. Migration

| Content type | Count | Images | Notes |
|---|---|---|---|
| `staffMember` | 9/9 | — (none in source data) | All 9 team members, names + roles |
| `openingHours` | 1 (singleton) | — | Full weekly schedule incl. Monday/Wednesday split shifts, from `clinicSchedule` |
| `closurePeriod` | 0 | — | **Nothing to migrate** — no vacation/closure data exists anywhere in the local source (`announcements.json` has no active vacation entry). Not a gap in the migration; a gap in the source data, correctly reflected as empty. |
| `announcement` | 1/1 | — | The current "regulär geöffnet" notice |
| `service` | 7/7 | 7/7 referenced images uploaded & linked | All Leistungen pages' content |
| `blogPost` | 2/2 | — (none in source data) | Both existing blog posts |
| `doctor` | 1/1 | 1/1 (portrait) | Dr. Ümit Alici's full profile |
| `legalDocument` | 8/8 (4 pages × 2 locales) | — | **Verbatim** text copy — see completeness note below |
| `siteSettings` | 1 (singleton) | 5/5 editable images uploaded & linked | Contact info + the old admin-panel's 5-image set + all `texts.*` overrides |
| **Total documents** | **30** | **7 unique images uploaded** | |

**Images:** all 7 referenced local images (`ordination-hero-pro.jpg`, `dr-alici-portrait-pro.jpg`, `dr-meier-pro.jpg`, `team-fr-alici-pro.jpg`, `leistungen-overview-pro.jpg`, `leistungen-foto-09-pro.jpg`, `leistungen-foto-10-pro.jpg`) uploaded once; mapping in `docs/migration/image-asset-map.json`.

**Legal content completeness check (binding condition 2):** found a **real gap**, not fixed — `impressum-de.ts` has 5 sections (including "Bildnachweise"/image credits), `impressum-tr.ts` has only 4 (missing a Turkish "Bildnachweise" equivalent). Flagged for human/legal decision, wording not touched.

**Repeatability (no duplicates):** migration script uses fixed, deterministic `_id`s (e.g. `service.allgemeine-hno`, `staffMember.frau-ruzica-tadic`) with `createOrReplace`. Verified: ran the script twice, document counts identical both times (`staffMember: 9, service: 7, blogPost: 2, legalDocument: 8, announcement: 1, doctor: 1, openingHours: 1, siteSettings: 1` — **total 30 both times**). **PASS.**

## 3. Before/after comparison (binding condition 2 & 6)

Three builds compared against the pre-migration baseline snapshot (63 pages each), using a text-content diff (`scripts/sanity/diff-build-content.mjs`) that strips scripts/styles and compares only rendered visible text:

| Build | Result |
|---|---|
| Local source (`CONTENT_SOURCE` unset, matches production) | **0/63 pages differ — PASS** |
| Sanity source (`CONTENT_SOURCE=sanity`) | **0/63 pages differ — PASS** |
| Simulated Sanity outage (`CONTENT_SOURCE=sanity` + invalid project ID) | **0/63 pages differ — PASS** (every loader logged a fallback warning and served local content) |

Image references separately verified (not caught by a text diff): scanned all 63 pages for empty/`undefined`/`null` `<img src>` values — **0 found**, in every one of the three builds. Sanity-sourced builds show real `cdn.sanity.io` URLs for every migrated image (hero, doctor/staff portraits, service images); local builds show the original `/images/...` paths — both resolve correctly in their respective mode.

## 4. Source of truth / no dual-write (binding condition 3)

- `CONTENT_SOURCE` is not set anywhere persisted (not in `.env.local`, not in any workflow file) — the **default** build (what production uses) always reads local JSON/TS, verified by the 0-diff result above.
- Content is only ever read from Sanity, never written to it, from any page-rendering code path — all writes happened exclusively through the one-off migration script, run manually, authenticated with a human-approved token.
- The existing admin panel (`public/admin/`) and its Cloudflare Worker (`workers/announcement-api.js`) were **not touched** — they remain the only live, user-facing editing system. **PASS** — no dual-write path exists.

## 5. Sanity outage / fallback test (binding condition 6)

Already covered in Section 3's middle row: build with `CONTENT_SOURCE=sanity` and an invalid `NEXT_PUBLIC_SANITY_PROJECT_ID` — every content loader (`editable-content`, `announcements`, `site.ts`, `doctor-profile`, `seo-services`, `blogPosts`, `legal/index`) logged a clear `[sanity] ...: falling back to local ...` warning and the build still completed with output identical to the pure-local baseline. **PASS.**

## 6. Rollback test (binding condition 6)

Build with `CONTENT_SOURCE` fully unset after the Sanity-sourced build — confirmed 0/63 page differences vs. the original baseline. Rolling back is simply: don't set `CONTENT_SOURCE=sanity` (which is already the default/production state — there is nothing to "undo" in code, since the Sanity integration is purely additive and opt-in). **PASS.**

## 7. Accessibility fix (gold-text contrast, binding condition 5.1)

New `--color-gold-ink` token computed from the original `--color-gold`'s hue/saturation, darkened to pass 4.5:1 against the lightest backgrounds it's used on (cream 4.70:1, white 4.98:1). `StarRating` got a `tone` prop; 29 usage sites across 19 files corrected to the token matching their actual background (light → `gold-ink`, petrol → `gold-light`, petrol-dark → unchanged, already compliant). Re-ran pa11y on the homepage and 5 other representative pages after the fix: **0 contrast errors**, down from 40 on the homepage alone before. Confirmed via a text-content diff that this CSS-only change altered no visible text. **PASS.**

## 8. npm vulnerabilities — documented, not silently fixed (binding condition 5.3)

See `docs/migration/npm-audit-risk-assessment.md`. One real production-facing critical finding (`next` itself, same-major-version fix available) flagged for the next milestone; the other 27 are Sanity CLI/Studio tooling or pure dev/lint dependencies that never reach the deployed site.

## 9. Orphaned legal JSON files (binding condition 5.2)

Not deleted, as instructed. Still sitting unused in `src/content/impressum.json`/`datenschutz.json`.

## 10. GitHub Actions (binding condition 4)

Documented in `docs/migration/github-actions-webhook-plan.md`. `.github/workflows/deploy.yml` **not modified**. No GitHub secrets created. No webhook configured in Sanity's dashboard. All of this needs a separate, explicit approval before being applied — this is the step that would make the site's production build actually start reading from Sanity, the most consequential remaining action.

## 11. Security (binding condition 7)

- All work stayed on the local branch; no `git push`, no PR, no merge.
- No DNS or production website changes.
- No API token value appears in any report in this `docs/` tree, in any committed file, or above in this report — every script reads the token from the gitignored `.env.local` at runtime.
- The temporary verification/migration API token (`local-verification-token`) was **revoked** after all approved migration and write/verification tests completed (confirmed via `npx sanity tokens list` showing zero tokens remaining).

## Overall: PASS

Every binding condition from this round is satisfied. The one deliberate, documented scope boundary is the live opening-hours ticker (Section 1) — a considered architectural decision, not a gap. The two items explicitly held back for a separate approval are the GitHub Actions/webhook wiring (Section 10) and, as before, the `next` framework upgrade (Section 8) and the legal-content completeness gap (Section 2) requiring human/legal sign-off.
