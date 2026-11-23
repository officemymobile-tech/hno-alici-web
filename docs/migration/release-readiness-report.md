# Release Readiness Report — Sanity CMS Integration

**Date:** 2026-11-21. **Branch:** `cms/phase2-4-audit-sanity` (local only — zero pushes, zero merges, zero production/DNS changes throughout this entire milestone). **Baseline:** `cd5cb78` (HEAD unchanged — nothing committed; all changes are uncommitted working-tree edits, reviewable via `git diff`/`git status`).

---

## 1. Critical Next.js security update — **PASS**

- Advisory data pulled via `npm audit --json` listed 15 distinct GHSA entries bundled under the `next` package, severities critical/high/moderate, affected range `>=16.0.0` up to various upper bounds (highest: `<=16.4.4`).
- **Verified, not assumed:** fetched the specific critical advisory (GHSA-673q-mjm6-r5xr, "Unauthenticated RCE in `use cache` functions returning typed arrays") directly — its own page states **patched at `16.4.1`**. Cross-checked Next.js's own GitHub release notes for 16.4.5 (lists 7 of the moderate cache-related advisories as fixed) and confirmed `16.4.6` is the actual `latest` dist-tag on npm (a real, current, stable release — not a canary).
- Upgraded `next` `16.2.7` → `16.4.6`, **same major version**, pinned exactly (matching the project's existing exact-pin convention) and synced `eslint-config-next` to the same version.
- Result: `next` no longer appears anywhere in `npm audit`'s vulnerability list at all. Remaining 25 findings (3 high, 22 moderate) are exclusively Sanity CLI/Studio tooling (never shipped to the deployed static site) and dev-only lint dependencies — see `docs/migration/npm-audit-risk-assessment.md` for the per-package breakdown.

## 2. Build / lint / audit / regression — **PASS**

- `npm run build`: succeeds, 0 errors.
- `npm run lint`: 11 problems, all pre-existing (6 errors/4 warnings predate this entire milestone) plus one `import/no-anonymous-default-export` **warning** (not error) on the new Worker file, matching the identical pre-existing style already present in `workers/announcement-api.js` — not a new class of issue.
- `npm audit`: see Section 1.
- Content-fidelity regression (text-diff across all 63 pages vs. the pre-Sanity-work baseline): **0 differences**, re-confirmed after the Next.js upgrade.
- Broken-link scan (`linkinator --recurse`): 0 broken, 103 links crawled (up from 100 pre-Studio, expected — Studio's own route adds links).
- Broken-image scan (empty/`undefined`/`null` `<img src>`): 0 across all 63 pages.

## 3. GitHub Actions webhook preparation — **PASS (prepared), BLOCKED (not activated)**

Prepared, reviewable, **not deployed, not merged**:

- **Secure design, not a naive one:** rather than pointing Sanity's webhook directly at GitHub's `repository_dispatch` endpoint (which only checks a bearer token, never verifies the payload actually came from Sanity), designed a small relay: Sanity webhook → `workers/sanity-rebuild-webhook.js` (new, not deployed) → GitHub. The Worker verifies Sanity's HMAC webhook signature first (via the official `@sanity/webhook` package's `isValidSignature`, **confirmed** to use `globalThis.crypto`/Web Crypto internally, not Node-only APIs, so it runs correctly in the Workers runtime) and only calls GitHub's dispatch endpoint on a valid signature.
- **Permissions:** the Worker's own GitHub token is deliberately scoped to only what `repository_dispatch` needs (`contents: read` + `actions: write`, not the existing announcements Worker's broader Contents-API write scope) — a separate, more narrowly-scoped credential, documented in the file's own header comment.
- **Secret management:** both secrets (`SANITY_WEBHOOK_SECRET`, `GITHUB_PAT`) are `wrangler secret put` values, same convention as the existing `hno-alici-announcements` Worker — never committed, documented in `workers/wrangler-sanity-rebuild.toml`'s comments.
- **Error handling:** invalid/missing signature → 401; unparseable payload → 400; GitHub API network failure or non-204 response → 502 (so Sanity's own webhook retry/backoff mechanism retries automatically rather than the trigger silently vanishing).
- **The actual `deploy.yml` diff** (permission-gated, applied only after explicit approval): adds a `repository_dispatch: types: [sanity-content-published]` trigger alongside the existing `push`/`workflow_dispatch` triggers. **Deliberately does not** add `CONTENT_SOURCE: sanity` to the workflow — the trigger existing is harmless on its own; nothing calls it yet (no webhook configured, Worker not deployed), and even if it somehow fired, the resulting build would still read local content, since the content-source switch is a separate, still-unmade decision.
- **Still not done** (needs separate, explicit approval per your "noch keine Aktivierung" instruction): deploying the Worker, creating its two secrets, creating a GitHub PAT for it, configuring the actual webhook URL in Sanity's dashboard, and — the biggest one — setting `CONTENT_SOURCE: sanity` anywhere in the production workflow. None of these happened.

## 4. GitHub Pages deployment behavior (Studio URLs, reloads, deep links) — **PASS**

- Built a server that precisely mimics GitHub Pages' real unmatched-path behavior (HTTP 404 status + `404.html`'s content as the body — verified this is genuinely different from `npx serve`'s default behavior, not assumed equivalent).
- Found and fixed a real gap: a browser refresh or direct link to a Studio sub-route (e.g. `/studio/structure/openingHours`) had no matching static file and would 404 on real GitHub Pages. Implemented a build-step injection (`scripts/inject-studio-404-fallback.mjs`, wired into `npm run build`) that adds a small script to `out/404.html`: for any `/studio/*` path, it fetches and swaps in the real Studio bundle client-side (URL bar keeps the deep path; Sanity Studio's own router reads it on mount) — no visible redirect, sub-path preserved. Falls back to a plain redirect to `/studio/` only if that fetch itself fails.
- **Verified in a real browser via Playwright** against the GitHub-Pages-behavior simulator (not just reasoned about): direct `/studio/` load (200), hard reload on `/studio/` (200), a deep Studio sub-route that returns HTTP 404 at the network level but does **not** show the generic "page not found" message to the user, and confirmed a genuinely nonexistent path still shows the real 404 (the fallback doesn't over-trigger). All 4 checks pass on both desktop and mobile Chromium.
- Incidentally found and documented (not fixed, pre-existing, confirmed present in the original baseline snapshot before any of this milestone's work): `out/404.html` and `out/studio/index.html` are missing explicit `<html>`/`<head>` opening tags from `src/app/layout.tsx` not rendering them — browsers' HTML5 parser auto-corrects this, confirmed functionally fine via direct tests, but it's invalid markup. Flagged for the next milestone's technical SEO/HTML-validity pass, not touched here (out of scope, unrelated to Sanity work, a root-layout change with its own blast radius).

## 5. Full Playwright regression suite — **PASS**

**78/78 tests pass** across 2 browser projects (desktop Chromium + mobile/Pixel-7 Chromium emulation), run against the actual GitHub-Pages-behavior simulator serving the real `next build` static output (not `next dev`):

| Area | Coverage | Result |
|---|---|---|
| DE/TR | Every spec runs against both locales | PASS |
| Navigation | Homepage load + console-error check, header link sampling, locale switcher, footer | PASS |
| Team | Staff roster renders with real migrated names | PASS |
| Leistungen | Overview + a service detail page | PASS |
| Blog | Index + a post page | PASS |
| Öffnungszeiten | Confirms the real split-shift hours (09:00/13:00/19:00) are what's shown, not the Phase-2-era bug's continuous block | PASS |
| Urlaub | No active closure data exists anywhere in the source (confirmed in the Phase 4 migration) — tested the closest real proxy (the announcement banner doesn't error in its absence); **no distinct UI exists yet to test closure-period display itself**, documented as a scope limit, not a failure | PASS (of what exists) |
| Formulare | Required-field validation, native consent-checkbox validation (see finding below), full submit → thank-you-state flow, title-wording regression guard | PASS |
| SEO | Title-duplication regression guard, canonical correctness on both the real and duplicate-content page variants, hreflang reciprocity, JSON-LD opening-hours regression guard, `robots.txt` disallow entries | PASS |
| Mobile | Every spec also runs under the Pixel 7 emulation project | PASS |

**One real (minor) finding surfaced while writing these tests, not previously known:** `AppointmentForm`'s consent checkbox has the native HTML `required` attribute, which means the browser's own validation blocks form submission *before* React's `onSubmit` handler — and therefore before the custom `consentRequired` German/Turkish error message (`"Bitte bestätigen Sie die Datenschutzeinwilligung."`) ever has a chance to render. The end-user-visible result is still correct (the form doesn't submit without consent — the browser's own validation UI shows instead), so this is cosmetic/dead-code, not a functional break; noted for a future cleanup, not fixed here (out of this milestone's scope).

Full JSON report: `docs/migration/playwright-report.json`.

## 6. `CONTENT_SOURCE=sanity` → `local` rollback — **PASS**

Re-tested after the Next.js upgrade specifically (not just carried forward from before): built with `CONTENT_SOURCE=sanity` (using a fresh, explicitly-approved, viewer-only token), confirmed 0 content differences vs. baseline and real `cdn.sanity.io` image URLs; then rebuilt with `CONTENT_SOURCE` unset and confirmed 0 content differences vs. the same baseline. The token was revoked immediately after (`npx sanity tokens list` now shows zero tokens on the project) and removed from `.env.local`.

## 7. Opening-hours ticker consistency risk — **DOCUMENTED, BLOCKED for hours-specific cutover**

Full writeup: `docs/migration/opening-hours-consistency-risk.md`. Summary: the live "open now" ticker is a client component reading a hardcoded local constant, independent of the Sanity-backed `siteSettings.textOverrides` hours text and the migrated-but-unread `openingHours` Sanity document — editing hours via Sanity today would **not** update the live ticker, a genuine risk of showing patients inconsistent information. Solution documented (thread a build-time Sanity fetch down as a prop, replacing the ticker's direct import, with the same local-fallback pattern every other content type already has) but **not implemented in this round** — scoped as its own small follow-up. Interim mitigation (no code change needed): don't present hours-editing via Sanity Studio as safe/live to staff until that refactor lands. This blocks *only* the hours-editing slice of the eventual cutover — team, services, blog, announcements, and contact info have no equivalent dual-source risk.

## 8. Legal texts and orphaned JSON — **PASS (unchanged, as instructed)**

`src/content/impressum.json`/`datenschutz.json` still untouched. No legal wording changed anywhere. Open question carried forward, unresolved, needing legal/human review: the German Impressum has a 5th section ("Bildnachweise" — image credits) that the Turkish version is missing entirely (confirmed by direct comparison of `impressum-de.ts` vs. `impressum-tr.ts`'s section lists during the migration).

---

## Rollback plan

Everything in this milestone is additive and gated behind `CONTENT_SOURCE`, which is unset everywhere that matters (no `.env.local` persistence, no workflow env var). Three rollback scenarios, all already tested, not theoretical:

1. **"Nothing has shipped yet" rollback (current state):** there is nothing to roll back — this branch has never been pushed or merged. Discarding it (`git checkout main` / deleting the branch) fully reverts to the pre-milestone state with zero residue, except the already-migrated Sanity project itself (`qhrodl8k`), which costs nothing to leave sitting unused.
2. **"Already activated, need to revert" rollback (future scenario, once Section 3's remaining steps are eventually done and merged):** remove/revert the `CONTENT_SOURCE: sanity` workflow env var (or the PR that added it) and push a fixed `deploy.yml` — the very next build reads local content again, verified identical (Section 6) to the pre-Sanity state. No data loss: nothing about the local JSON/TS files is deleted by any part of this milestone.
3. **Dependency rollback:** `next@16.4.6` is a drop-in patch upgrade within the same major version, verified via the full build/lint/content-diff/Playwright suite above — reverting to `16.2.7` would reintroduce the critical CVE and is not recommended, but is mechanically just `npm install next@16.2.7 eslint-config-next@16.2.7` if ever needed.

## Required production approvals (nothing below has happened)

| # | Action | Status |
|---|---|---|
| 1 | Push/merge this branch to `main` | **Not requested, not done** |
| 2 | Deploy `workers/sanity-rebuild-webhook.js` via `wrangler deploy` | **Not done** — needs its own approval |
| 3 | Create the Worker's two secrets (`SANITY_WEBHOOK_SECRET`, `GITHUB_PAT`) | **Not done** |
| 4 | Configure the actual webhook URL + secret in Sanity's dashboard | **Not done** |
| 5 | Set `CONTENT_SOURCE: sanity` anywhere in a production-reachable workflow (the actual live-site cutover) | **Explicitly not approved by you yet — correctly not done** |
| 6 | Opening-hours ticker refactor (Section 7) | **Must land before item 5, specifically for hours content** |
| 7 | Legal/TR-Impressum completeness decision | **Needs a legal reviewer, not a technical one** |
| 8 | `next` 16.4.6 upgrade reaching production | Technically ready (fully tested); still requires the same merge/deploy approval as everything else here |

---

## GO / NO-GO recommendation

**GO for merging this branch's code changes, once reviewed — NO-GO for activating the Sanity content switch in production.**

Evidence for the "GO on the code" half: every automated check that can be run without deploying (build, lint, dependency audit, 78-test Playwright suite across desktop+mobile, three-way content-fidelity diff, GitHub-Pages-behavior simulation, security-token hygiene) passes, the critical CVE is resolved with a verified minimum-version fix, and the webhook design was reviewed for exactly the properties you asked about (permissions, signature verification, secret handling, error handling) rather than a naive implementation.

Evidence for the "NO-GO on activation" half: the opening-hours ticker inconsistency (Section 7) is a real, specific risk to patients if hours are edited via Sanity before that refactor lands, and the legal-content completeness gap (Section 8) needs a human/legal call, not a technical one — neither is resolved yet, and you had already withheld approval for the content-switch activation regardless.

**Recommended next step:** review and merge the code (upgrade + audit docs + Playwright suite + webhook prep + 404 fallback) as its own safe, low-risk change, independent of any Sanity activation decision — then treat the opening-hours refactor and the legal sign-off as the two concrete, named blockers standing between here and an actual cutover.
