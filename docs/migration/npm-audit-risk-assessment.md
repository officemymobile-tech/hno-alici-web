# npm Audit — Actual Risk Assessment (not just a vulnerability count)

Raw `npm audit` count: **28 vulnerabilities (1 critical, 5 high, 22 moderate)**, up from 18 before the Sanity toolchain was installed. Counting alone overstates the real exposure — most of these never ship to the deployed static site. Breaking it down by what's actually affected:

## Actually shipped to production (the deployed static site)

| Package | Severity | Direct? | Real exposure | Fix |
|---|---|---|---|---|
| `next` | **Critical** | Yes | The framework itself, used to build and serve every page. This is the one finding that matters most. | `next@16.4.6` available — **same major version**, not a breaking upgrade. Not applied here (out of this milestone's scope per the plan's Section 7 boundary — flagged as the #1 priority for the next milestone's Security Audit). |
| `postcss` | High | No (transitive, via `next`) | Build-time CSS processing only, not shipped to the browser | Resolved by the same `next@16.4.6` upgrade |
| `sharp` | High | No (transitive, via `next`) | Build-time image processing only (and `images.unoptimized: true` means it's barely used anyway) | Resolved by the same `next@16.4.6` upgrade |
| `brace-expansion` | High | No (transitive) | Build-tooling glob matching, not shipped | Non-major fix available directly |

## Sanity CLI / Studio tooling only — never reaches the deployed site

All 22 moderate findings except `next-sanity`/`@sanity/vision` are internal dependencies of the `sanity` CLI package itself (`@oclif/*`, `@sanity/*-cli`, `@sanity/blueprints`, `@vercel/frameworks`, `minimatch`, `js-yaml`, `smol-toml`) — these run only when a human invokes `npx sanity ...` locally (login, project management, `sanity dev`) or when someone loads `/studio/` (which is `noindex`'d, gated behind Sanity's own login, and whose bundle is separate client-side JS, not the static site's rendering path). **None of this is in the request path of a public visitor to hno-alici.at.** Upgrading `sanity` to the version npm suggests (`5.14.1`) is flagged `isSemVerMajor: true` — a major-version change not undertaken here without dedicated testing, since it could affect the schema/Studio APIs this migration just built against.

`next-sanity` (moderate, direct) and `@sanity/vision` (moderate, direct) are also Studio/build-tooling only — `next-sanity`'s runtime client code (what actually runs in the production build) is a thin, stable wrapper; the flagged vulnerability is in its CLI/tooling surface, not the `createClient`/`fetch` path this migration uses.

## `@typescript-eslint/*` (moderate) and `typescript-eslint` (moderate)

Pure lint-time dev tooling. Zero runtime or deployment exposure under any circumstance.

## Bottom line

**One real, actionable production risk**: the `next` critical finding, with a same-major-version fix already available. Recommended as the first item in the next milestone's Security Audit, not addressed in this pass (framework version bumps are explicitly out of scope for the Sanity-integration work approved here). Everything else is either CLI-only tooling that never ships, or pure dev-time lint dependencies.
