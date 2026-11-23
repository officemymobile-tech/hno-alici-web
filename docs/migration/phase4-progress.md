# Phase 4 — Sanity CMS Progress

**Status:** Schema, Studio, and desk-structure groundwork complete and build-verified (per plan Section 4.5, step 1 — build succeeds locally with no real Sanity project configured, via a graceful fallback). **Blocked on the one real STOP-GATE:** a Sanity project ID (plan Section 4.5) before query wrappers can be wired to real data, before any content migration (4.1a), and before the verification test (4.6).

## Done

- **Dependencies:** `sanity@6.24.0`, `next-sanity@13.5.1`, `@sanity/image-url@2.2.0`, `@sanity/vision@6.24.0`, `styled-components@^6`, `@sanity/client@^8` — all confirmed compatible with this project's `react@19.2.4`/`next@16.2.7`/Node 24 via each package's own peer-dependency declarations (checked directly, not assumed).
- **Schema** (`sanity/schemaTypes/`): all 9 planned document types (`doctor`, `staffMember`, `openingHours`, `closurePeriod`, `announcement`, `service`, `blogPost`, `siteSettings`, `legalDocument`) plus shared objects (`localeString`, `localeText`, `timeWindow`). Field shapes were checked against the actual source files they'll replace (`doctor-profile.ts`, `site-editable.json`, `seo-services.ts`, `seo-landings.ts`'s `blogPosts`, `site.ts`'s `siteConfig`, `legal/types.ts`), not guessed.
- **Desk structure** (`sanity/structure.ts`): `openingHours` and `siteSettings` pinned as singletons (fixed document ID, no "create new" option, delete/duplicate actions disabled in `sanity.config.ts`).
- **Studio route** (`src/app/studio/[[...tool]]/page.tsx`): embedded, `noindex`, added to `robots.ts`'s disallow list. **Discovered and fixed a real Next.js 16 breaking change** (confirmed via an actual build failure, not assumed from the reference project): `next/dynamic`'s `ssr: false` is no longer allowed directly inside a Server Component in this version — split into a `StudioLoader.tsx` Client Component wrapper so `page.tsx` can stay a Server Component for `generateStaticParams`/`metadata`.
- **Graceful unconfigured state:** `sanity/env.ts` no longer throws when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset (unlike the common Sanity starter pattern) — `Studio.tsx` checks `isSanityConfigured()` and shows a friendly German placeholder message instead of attempting to load `NextStudio`. Verified: `npm run build` succeeds with no Sanity env configured at all, proving the rest of the site is unaffected.
- **Verified in the rebuilt `out/`:** `/studio/` returns 200 and serves the placeholder shell (confirmed via `curl`, not assumed); `robots.txt` now disallows `/studio/`; all pre-existing routes still build (file count: 637 → 1272, the increase being Sanity Studio's own JS/CSS bundle, not a loss of existing pages).

## Known limitation flagged for the Phase 4.6 verification test (not yet solved, don't assume it works)

Under `output: "export"` on GitHub Pages (no server), only `/studio/`'s root shell is pre-rendered. A hard refresh or shared link straight into a Studio sub-route (e.g. `/studio/structure/openingHours`) will 404, since GitHub Pages has nothing to fall back to this shell for unknown paths. The standard static-host fix is a custom `404.html` that re-serves this page's HTML — not yet added. This needs to be in place and tested before Studio is relied on for real day-to-day editing.

## STOP-GATE resolved (2026-11-21)

The user ran the login/project-creation steps themselves. What actually happened, in order:

1. `npx sanity login --provider sanity` — authenticated.
2. `npx sanity projects list` — came back **empty**: the account had no projects, and (discovered one level deeper) **no organization either**. Sanity now requires every project to belong to an org.
3. Org creation (`npx sanity organizations create --name "HNO Alici"`) and API token creation were both intercepted by the auto-mode permission classifier as sensitive/destructive actions — correctly, since one mints an account-level entity and the other mints a credential. Both were explicitly confirmed with the user before proceeding (see conversation).
4. Organization created: **`owci0oa5h`** ("HNO Alici").
5. Project created under it: **project ID `qhrodl8k`**, name `hno-alici-web`, dataset `production` (public — chosen so build-time GROQ fetches need no read token).
6. `.env.local` created (confirmed gitignored via `git check-ignore`) with `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`.
7. `npm run build` re-run with the real project ID — succeeds; confirmed the ID is actually inlined into the client bundle (grepped `out/_next/static/chunks/*.js`), not just present in `.env.local` unused.
8. A project-scoped **editor** API token was created (`local-verification-token`, scoped to `qhrodl8k` only, not org-wide) after explicit user approval, stored only in `.env.local` as `SANITY_API_TOKEN` (never `NEXT_PUBLIC_*`, never committed).

## Verification test (plan Section 4.6) — run against the real project, not simulated

`scripts/sanity/verify-connection.mjs` (kept as a reusable script, not a throwaway) ran directly against project `qhrodl8k` via `@sanity/client`/`next-sanity`, using the public (no-token) client for reads and the editor token only for writes:

| Check | Result |
|---|---|
| **Read** — seed `siteSettings` + `staffMember`, read back with the public, token-less, `perspective: "published"` client | **PASS** |
| **Write** — patch `staffMember.role`, confirm the published-perspective read reflects the edit | **PASS** |
| **Draft safety** — create an `announcement` as a `drafts.*` document, confirm the published-perspective query returns an empty array for it | **PASS** |
| **Publish** — move the draft to its published ID, confirm it now appears in the published-perspective read | **PASS** |

Test `staffMember` and `announcement` documents were deleted after the run. The `siteSettings` document was **kept** (seeded with the real, already-confirmed values — name, phone `+4316025400`, email `ordination@hno-alici.at` — not placeholder data) as the actual first real singleton document.

**Not yet tested:** the "Preview" sub-check (visually confirming draft/published states inside the actual Studio UI — the script-level test above is an equivalent but non-visual proof) and the full "Publish → Sanity webhook → `repository_dispatch` → GitHub Actions run" pipeline (Section 4.3), which needs a webhook configured in Sanity's dashboard and a new GitHub Actions trigger — not done yet, see below.

## Still remaining in Phase 4

- `src/lib/sanity/client.ts` now exists (build-time-only client, `useCdn: false` during this verification phase, `perspective: "published"`) but the actual GROQ query **wrapper functions** replacing `getEditableContent()`, `getActiveAnnouncement()`, `getLegalDocument()`, etc. are not yet written — the frontend pages still read from the local JSON/TS content files, not from Sanity.
- Content/image migration script (4.1a) — not yet run; `siteSettings` was seeded directly as part of the verification test above, but the rest of the content (team, opening hours, services, blog, legal) has not been migrated.
- GitHub Actions webhook-rebuild wiring (4.3) — needs a webhook configured in Sanity's dashboard pointing at a `repository_dispatch` call, and a new trigger block in `.github/workflows/deploy.yml` (or a new workflow). Not done — this touches the production workflow file, so needs explicit approval before being added, per binding condition 10.
- Rollback test (4.7a) and cutover (4.8) both still require the above.

## Side effect to flag

Installing the Sanity toolchain added ~900 packages; `npm audit` now reports 28 vulnerabilities (22 moderate, 5 high, 1 critical), up from 18 before this work (8 moderate, 9 high, 1 critical — noted in the Phase 2 audit report). Not fixed here — explicitly carried into the next milestone's Security Audit per the plan's scope boundary, same as the original 18.
