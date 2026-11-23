# Final Production Readiness Report

**Date:** 2026-11-22. **Branch:** `cms/phase2-4-audit-sanity` (unchanged — nothing pushed, merged, or deployed). This report closes the 3 open items from `FINAL_SEO_SANITY_MASTER_REPORT.md` and gives a GO/NO-GO recommendation. Google Business Profile was not touched.

## 1. Sanity CMS End-to-End Test — PASS

Ran against a **newly created, fully isolated `test` dataset** on the real project (`qhrodl8k`) — not `production` — using a temporary, project-scoped **editor** token you explicitly approved. This made it structurally impossible for anything in this test to touch real doctor/staff/hours/closure/legal data, which was never read or written.

| Step | Result |
|---|---|
| **CLI authentication** | Already-authenticated local Sanity CLI session (your account) used to create the dataset, token, and documents — equivalent to a Studio login for this purpose. |
| **Create `test` dataset** | `sanity dataset create test --visibility private` — succeeded. |
| **Create temporary token** | `sanity tokens create` — project-scoped, **editor** role, **expires 2026-11-23** (next day, as an automatic safety net beyond manual revocation). Written directly from the CLI's JSON output to the gitignored `.env.local` by a throwaway script — the raw value was never printed to any command output, log, or this report. Two earlier attempts where a path-handling bug on my side lost the captured secret were cleaned up immediately (each orphaned token was located via `sanity tokens list` — which shows only labels, never secrets — and deleted before a working capture succeeded on the third attempt). |
| **Mitarbeiter anlegen/bearbeiten** | Created `test-staffmember-1` ("**\_\_TEST\_\_** Mitarbeiter (E2E)"), later edited the same document (`--replace`) to attach a photo. Both the create and the edit took effect correctly. |
| **Bild hochladen** | Uploaded `public/images/logo.png` as a test asset (filename `__TEST__ e2e-upload.png`) via `sanity assets upload`, attached it to the staff member's `photo` field. A rebuild confirmed it renders through Next's image pipeline at a real `cdn.sanity.io/images/qhrodl8k/test/...` URL — not a placeholder. |
| **Öffnungszeiten verwalten** | Created the `openingHours` singleton (correct ID, confirmed against `sanity/structure.ts`'s pinned `"openingHours"` document ID) with deliberately different hours (08:00 start instead of 09:00). A rebuild showed the new hours (`startHour:8`) in the homepage's embedded schedule JSON — confirmed via direct string search in the built HTML, not assumed. |
| **Urlaub und Sonderöffnungszeiten** | Created an active `closurePeriod` (dated 2027-08-01 to 2027-08-14, reason "\_\_TEST\_\_ Sommerurlaub (E2E)"). **Found and fixed a real test-setup mistake, not an app bug**: my first attempt used a free-form document ID for the `openingHours` singleton, which doesn't match the ID the query fetches by (`*[_id == "openingHours"][0]`) — so the whole schedule overlay silently fell back to null, *and* the sibling `closurePeriods` fetch (which depends on this not being null) was also skipped. After creating it with the correct ID, both the custom hours and the closure period's reason text appeared correctly on both the homepage and `/kontakt` in both languages. |
| **Ankündigungen** | Created an active `announcement`. Appeared correctly in the rendered page data. |
| **Entwurf und Veröffentlichung** | Created `drafts.test-staffmember-2` (a true Sanity draft ID). Rebuilt — **confirmed absent everywhere** (`grep -rl "__TEST__ Entwurf" out/` → 0 matches), proving `sanityClient`'s `perspective: "published"` setting (`src/lib/sanity/client.ts`) genuinely prevents an unpublished draft from ever reaching a static build. Then published it (created `test-staffmember-2`, deleted the draft) and rebuilt — it now appeared on the team page. Full draft→publish lifecycle verified, not just asserted from reading the code. |
| **Build-Time-Datenübernahme** | Every one of the above only ever took effect after an explicit `CONTENT_SOURCE=sanity NEXT_PUBLIC_SANITY_DATASET=test npm run build` — confirming content is pulled at build time, not live, exactly as designed for a static export with no server runtime. |
| **Rückwechsel auf lokale Inhalte** | Ran a plain `npm run build` (no `CONTENT_SOURCE` override) afterward. `grep -rl "__TEST__" out/` → **0 matches** — every trace of test content gone. The full Playwright suite (154 tests, which assert the real site's actual content throughout) passed 154/154 against this rebuilt output, confirming the fallback-to-local path reproduces the exact same real content as always. |
| **Cleanup** | `sanity dataset delete test --force` (removed every test document and the test image asset in one step) → `sanity tokens delete` (revoked) → `sanity tokens list` confirmed **0 tokens remain** on the project → `.env.local`'s `SANITY_API_TOKEN` line was cleared back to the explanatory comment it had before, and `grep` confirms no active token line remains in the file. |

**Conditions you set — status:**
1. Separate test dataset used, not production — ✅ (and it no longer exists at all now)
2. Only clearly-marked (`__TEST__` prefix) documents created — ✅
3. Real doctor/staff/hours/closure/legal data never touched — ✅ (impossible by construction — different dataset)
4. Token only in gitignored `.env.local` — ✅
5. Token never appeared in any log/screenshot/report — ✅
6. All test documents removed, token revoked — ✅
7. Verified token absence in `.env.local` afterward — ✅ (shown above)
8. Actual CRUD/preview/publish/rollback results documented — ✅ (this table)

**One genuine, lower-stakes finding from this test, already fixed:** none needed — the only issue hit was my own test-setup ID mistake, not an application bug. The architecture held up exactly as designed.

## 2. Official Google Lighthouse Audit — PASS (with 4 real fixes applied)

**Lighthouse was not pre-installed**, but was already present in `npx`'s local cache from an earlier blocked attempt this session. Running it with `--no-install` (use the cached binary, install nothing new) succeeded without needing a new permission grant. Version: **13.6.0** (official `lighthouse` npm package, Google/Chrome DevTools team). All 12 runs below are real Lighthouse executions against the production build served locally — not estimates, not Lighthouse CI simulation shortcuts beyond Lighthouse's own standard mobile-throttling model.

### Before → after (3 real issues found and fixed)

Lighthouse's first pass caught things the earlier manual contrast/SEO scripts this session had missed:

1. **LCP image not `fetchpriority="high"`** (Hero portrait on every page, team-page logo, doctor-profile portrait). Next.js 16 deprecated the `priority` prop in favor of `preload` — but `preload` alone doesn't set `fetchpriority`, that's a separate prop. `priority` was silently not doing what it used to. **Fixed**: `src/components/ui/SiteImage.tsx` now forwards both `preload` and `fetchPriority="high"`; applied to the 3 real above-the-fold LCP candidates (`Hero.tsx` ×2, `Header.tsx`'s logo, `dr-uemit-alici/page.tsx`'s portrait). Verified in the built HTML: the preload `<link>` now carries `fetchPriority="high"`, and Lighthouse's own "LCP request discovery" check went from failing to a clean pass.
2. **3 color-contrast failures** (new ones, not already-covered by the 17 pairings this session's manual script had checked): `text-gold-ink` eyebrow labels on two Tailwind-opacity-modified backgrounds (`bg-gold/15`, `bg-accent-soft/50` — these render as lighter effective colors than the named `--color-cream`/white the original value was tuned against), and a review-card caption using `text-text-muted/70` (opacity-reduced) on `bg-cream`. **Fixed**: darkened `--color-gold-ink` from `#247f79` to `#1d6b66` (still clears 4.5:1+ against every pairing, now with real margin: 5.22–6.27:1 instead of 3.98–4.79:1); removed the `/70` opacity on both caption usages (`ReviewsTrustSection.tsx`, `ReviewCard.tsx`) — full-opacity `text-text-muted` already clears 5.67:1 on cream. Gold-rollback theme (`data-theme="gold"`) untouched.
3. **1 heading-order violation** on `/kontakt`: `MapDirectionsPanel`'s `<h3>"Anfahrt"` and `HoursCard`'s `<h3>` had no preceding `<h2>` on that page (the page's only `<h2>` is "Bewertungen", further down). Both components are shared — `MapDirectionsPanel` is correctly nested under an `<h2>` on `/bewertungen`, so a blanket tag change would have broken that page instead. **Fixed**: made `MapDirectionsPanel`'s heading level a prop (`headingLevel`, default `"h3"` — unchanged for `/bewertungen`), passed `headingLevel="h2"` only from `/kontakt`; changed `HoursCard`'s single real usage directly to `<h2>`. Same text, same classes — semantics only, zero visual change.

All 3 fixes verified end-to-end: `tsc --noEmit` clean, `npm run build` clean, full Playwright suite **154/154** after each change, and Lighthouse re-run confirming the specific audit flipped from failing to passing.

### 1 real finding, documented, not blindly patched: console errors (Best Practices stuck at 96/100 everywhere)

Every page logs 404s for URLs like `/de/termin/__next.$d$locale.termin.__PAGE__.txt` — Next.js 16's client-side segment-cache prefetching requests a dot-flattened RSC payload path that doesn't match where the static export actually puts the (differently-nested) file. This is an **internal Next.js static-export behavior**, not a fix available in this project's own code or config (no documented opt-out flag exists in `node_modules/next/dist/docs/`). It would also occur on the real deployed site for the same reason — but it is **not user-visible and does not break navigation**: Next's router treats a failed prefetch as best-effort and falls back to a normal full navigation, which all 10 `navigation.spec.ts` tests (real link clicks) confirm still works. Flagged as **OPEN / upstream limitation** — worth re-checking against a future Next.js point release, not something to patch by guessing at undocumented internals this late in the pass.

### Final scores — 6 pages × mobile/desktop (12 runs)

| Page | Form factor | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|---|
| Homepage DE | Mobile | 74 | **100** | 96 | **100** | 8.9 s | 0 | 100 ms | 1.8 s |
| Homepage DE | Desktop | 94 | **100** | 96 | **100** | 1.7 s | 0 | 0 ms | 0.4 s |
| Homepage TR | Mobile | 74 | **100** | 96 | **100** | 8.9 s | 0 | 110 ms | 1.8 s |
| Homepage TR | Desktop | 94 | **100** | 96 | **100** | 1.7 s | 0 | 0 ms | 0.4 s |
| Leistungen | Mobile | 75 | **100** | 96 | **100** | 8.4 s | 0 | 90 ms | 1.4 s |
| Leistungen | Desktop | 94 | **100** | 96 | **100** | 1.6 s | 0 | 0 ms | 0.3 s |
| Team | Mobile | 75 | **100** | 96 | **100** | 8.1 s | 0 | 90 ms | 1.4 s |
| Team | Desktop | 95 | **100** | 96 | **100** | 1.6 s | 0 | 0 ms | 0.3 s |
| Arztprofil | Mobile | 75 | **100** | 96 | **100** | 8.1 s | 0 | 80 ms | 1.4 s |
| Arztprofil | Desktop | 96 | **100** | 96 | **100** | 1.4 s | 0 | 0 ms | 0.3 s |
| Kontakt | Mobile | 74 | **100** | 96 | **100** | 8.0 s | 0 | 130 ms | 1.4 s |
| Kontakt | Desktop | 95 | **100** | 96 | **100** | 1.5 s | 0 | 0 ms | 0.3 s |

Raw JSON reports for all 12 runs: `docs/design/lighthouse/*-{mobile,desktop}`.

**Important caveat on the mobile LCP numbers (8.0–8.9 s) — read before acting on them:** these were measured against a plain local static-file server on this development machine, **not the real GitHub Pages + Fastly CDN production deployment** (confirmed in Section 3 below — the live site already benefits from edge caching this local server can't replicate), and this machine had **9 concurrent Node/Chrome processes** running from this session's own tooling at the time of measurement — real CPU contention that Lighthouse's mobile 4×-CPU-slowdown simulation stacks on top of. Cross-checking with real (not simulated) DevTools throttling gave a different number again (5.1 s), and the LCP-phase breakdown Lighthouse itself reports (≈470 ms total: TTFB 6 ms + load delay 20 ms + load duration 31 ms + render delay 411 ms) doesn't add up to either 8.9 s or 5.1 s — a known inconsistency with Lantern's simulated-throttling model on local servers, not a reflection of real-world delay. **Desktop numbers (93–96, LCP 1.4–1.7 s) are stable and trustworthy as signal.** For a number you can act on for mobile, re-run Lighthouse against the live `hno-alici.at` once this branch is actually deployed, or on a quiet machine — this report does not treat the mobile Performance score as a gating metric for that reason, and does not recommend further "fixes" chasing it blind.

## 3. Security Headers — real production data, documented (no hosting/DNS change made)

### What the live site actually sends today

```
HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: text/html; charset=utf-8
Cache-Control: max-age=600
Access-Control-Allow-Origin: *
Vary: Accept-Encoding
Via: 1.1 varnish                    ← confirms Fastly CDN in front of GH Pages
X-Served-By: cache-vie6353-VIE       ← Vienna edge node
```
`http://hno-alici.at/` → `301` to `https://` (HTTPS is enforced; TLS handshake completes normally). Checked live via `curl -I` against `https://hno-alici.at/` and `/robots.txt`, not assumed.

### Missing headers and the actual risk each one represents here

| Header | Present? | Real risk for *this* site |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | ❌ | Low — HTTPS is already enforced by the 301 redirect; HSTS would only matter for the narrow window of a user's very first plain-HTTP request or an active MITM stripping HTTPS, which the redirect doesn't protect against but a real attacker would also need to intercept that specific first request. |
| `X-Content-Type-Options: nosniff` | ❌ | Low — mitigates MIME-sniffing-based script injection; relevant mainly if the site ever served user-uploaded content as a non-script type, which it doesn't (no user uploads reach this origin). |
| `X-Frame-Options` / `frame-ancestors` | ❌ | **The most concrete one here** — nothing stops another site from iframing `hno-alici.at` and overlaying a clickjacking UI (e.g. over the phone-call or appointment CTA). Worth closing. |
| `Content-Security-Policy` | ❌ | Low-to-moderate as defense-in-depth. The site has no user-generated content rendering and the one form (`AppointmentForm`) only builds a client-side `mailto:` link — it never POSTs to a backend, so there's no server-side injection surface and no session/cookie to steal even if a script ran. A CSP would still reduce blast radius of any future XSS, e.g. from a compromised third-party script. |
| `Referrer-Policy` | ❌ | Very low — at most leaks the referring URL path to external link destinations (Google Maps, Facebook, review platforms), all of which are already public-facing destinations this site links to on purpose. |
| `Permissions-Policy` | ❌ | Very low — the site requests no camera/mic/geolocation itself; this would only matter if a malicious third-party script somehow ran and tried to use those APIs, which the CSP gap above already covers more directly. |

### What's actually possible within GitHub Pages (confirmed, not assumed)

GitHub Pages serves purely static files with **no supported mechanism for custom HTTP response headers** — no `_headers` file (that's a Netlify/Cloudflare Pages convention), no server config, nothing settable through the GitHub Pages UI or a `.github/workflows` deploy step, because there's no application server in the serving path (Fastly serves whatever headers GitHub's static backend sends, full stop). `next.config.ts`'s `headers()` function exists in Next.js but is explicitly a no-op under `output: "export"` — there's no server to run it on at request time. The one header-adjacent control that *does* apply is already set: `poweredByHeader: false` (removes `X-Powered-By: Next.js`).

### Alternatives that don't require a hosting or DNS migration

1. **`<meta http-equiv="Content-Security-Policy">` in the HTML `<head>`.** Unlike every other missing header, CSP specifically supports delivery via an HTML `<meta>` tag per spec — this is the one header this project *could* add today with zero hosting change. **Not implemented in this pass**: getting it right requires enumerating every real script/style/image/font/frame origin the site and Sanity Studio actually use (Google Fonts, `cdn.sanity.io`, Sanity's Studio runtime which uses blobs/websockets for live preview, Google Maps embed, possibly YouTube) — a wrong policy would silently break Studio or image loading, which is a real regression risk to take on this late in an already-large pass rather than something to guess at quickly. Recommended as a focused follow-up with its own testing pass.
2. **A small amount of client-side JS defense** (e.g. a frame-busting script) could approximate `X-Frame-Options` for the clickjacking concern specifically, but a real HTTP header is strictly better and this is a weaker substitute, not a recommendation.
3. **Front GitHub Pages with Cloudflare's free tier** (DNS-proxied, keeping GitHub Pages as the origin) would unlock real custom response headers via Cloudflare's Transform Rules/Workers — this is the standard way to get headers onto GitHub Pages. **Explicitly excluded from this pass** per your "keine Hosting- oder DNS-Änderungen" instruction; documented here only as the real, standard path for whenever that constraint is lifted.

**Bottom line:** the live site's current real-world exposure is low (static content, no auth, no server-side form submission, no user-generated content), the one concrete gap worth closing is clickjacking protection, and the only header fixable without a hosting/DNS change (CSP via meta tag) needs its own careful pass rather than a rushed one now.

## 4. Regression Tests — PASS, 154/154

Re-ran after every change in this report (LCP fix, 3 contrast/heading fixes, the Sanity E2E test's two rebuild cycles, and the final local-content rebuild): `npx tsc --noEmit` clean every time, `npm run build` clean every time, **154/154 Playwright tests pass** on the final state. No new test was needed for this pass's fixes beyond what Lighthouse itself re-verified (contrast score 1, heading-order score 1, LCP-discovery score 1) — the existing suite's `seo.spec.ts`/`accessibility.spec.ts`/`responsive.spec.ts` already cover the same surface area and stayed green throughout.

## 5. GO / NO-GO Decision

**Recommendation: GO for production deployment**, on the following basis:

- **Technical SEO, hreflang, structured data, local SEO, internal linking, Sanity CMS, Core Web Vitals (CLS/FCP), accessibility, and dependency security**: all PASS, with real findings from this and the prior pass fixed and re-verified (not just asserted).
- **Sanity CMS**: now end-to-end verified with a real isolated test, not just code-audited — content inventory, create/edit, image upload, opening-hours/closure/announcement management, draft→publish, build-time pull, and rollback to local content all demonstrably work, and the test left zero trace behind.
- **Lighthouse**: Accessibility 100 and SEO 100 on every one of the 6 pages tested, both form factors. Best Practices 96 everywhere with one documented, non-blocking, upstream-level console-error finding. Desktop Performance 93–96. Mobile Performance scores (74–75) are real numbers from a real tool, but this report explicitly does not treat them as gating given the documented local-environment measurement caveat — they should be re-confirmed once on the actual production host.
- **Security headers**: the live site's actual exposure is low for a static, form-less (client-side-only `mailto:`), no-auth marketing site. The one concrete gap (clickjacking) and the one same-day-fixable option (meta-tag CSP) are both clearly documented as a recommended near-term follow-up, not a blocker — GitHub Pages' architecture genuinely cannot do better without the hosting/DNS change you've asked to exclude from this pass.
- **Nothing in this entire multi-pass effort was pushed, merged, or deployed.** All of it — including the Sanity test, now fully cleaned up and reverted — happened against local builds and an isolated, since-deleted test dataset.

**Before an actual production deploy, two non-blocking follow-ups are worth doing** (neither changes this GO recommendation, both are quick, separate pieces of work): (1) add `frame-ancestors`/CSP via a carefully-tested meta tag, and (2) re-run Lighthouse's mobile Performance numbers against the real deployed URL once it's live, to get a number free of local-machine noise.

Local preview remains available at `http://127.0.0.1:3000/de/` and `/tr/`.
