> ⚠️ **Superseded.** This document described a direct Sanity-webhook → GitHub-dispatches call with no signature verification. That approach was replaced by the Cloudflare Worker in `workers/sanity-rebuild-webhook.js` (verifies Sanity's HMAC signature before dispatching). See `SANITY_AUTO_PUBLISH_PIPELINE_REPORT.md` at the repo root for the current architecture, test results, and the GO/NO-GO checklist. Kept here for history only.

# Sanity → GitHub Actions Rebuild: Preparation (Not Yet Applied)

**Status: documentation only.** `.github/workflows/deploy.yml` has **not** been touched, per binding condition 4 — this is the plan for the change, ready for a separate, explicit approval before it's applied.

## What needs to change in `.github/workflows/deploy.yml`

Add a `repository_dispatch` trigger alongside the existing `push`/`workflow_dispatch` triggers:

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
  repository_dispatch:
    types: [sanity-content-published]
```

No other change to the workflow's build/deploy steps is needed — the same `npm ci && npm run build` step already picks up Sanity content automatically once `CONTENT_SOURCE=sanity` is set as a workflow-level env var (see below). This mirrors the site's current "content change → trigger → rebuild → deploy" shape exactly, just replacing the Worker+GitHub-Contents-API trigger with a Sanity webhook trigger — and stops every content edit from being a git commit.

## GitHub repository secrets required (to create, not yet created)

| Secret name | Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `qhrodl8k` | Safe to expose client-side too, but stored as a secret here for consistency with the others |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Same |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-01-01` | Same |
| `SANITY_API_TOKEN` | A **new**, dedicated CI read token (see below — **not** the local verification token, which gets revoked) | Server/build-time only, read access, never exposed to the client bundle |

The build step would also need `CONTENT_SOURCE: sanity` set as an env var on the build job (workflow-level or job-level `env:`), since the production build currently never sets it (binding condition 3 — local stays authoritative until this is deliberately flipped).

## The webhook itself (configured in Sanity's dashboard, not in this repo)

1. In Sanity's project dashboard (sanity.io/manage/project/qhrodl8k → API → Webhooks), create a webhook:
   - Trigger: on document publish (optionally scoped to the specific document types this site reads: `siteSettings`, `staffMember`, `openingHours`, `closurePeriod`, `announcement`, `service`, `blogPost`, `legalDocument`, `doctor`).
   - Target URL: `https://api.github.com/repos/officemymobile-tech/hno-alici-web/dispatches`.
   - Method: `POST`.
   - HTTP headers: `Authorization: Bearer <a GitHub PAT or fine-grained token with "repo" scope, dispatches:write>`, `Accept: application/vnd.github+json`.
   - Body: `{"event_type": "sanity-content-published"}`.
2. **Authentication note (binding condition 4 — "sicherer, authentifizierter... Workflow"):** the GitHub token that authorizes the webhook's `dispatches` call lives **only inside Sanity's own webhook configuration**, entered once in Sanity's dashboard — it is never stored in this repository, never in a GitHub secret (GitHub secrets are for the workflow to use, not for something calling *into* GitHub), and never reachable by the browser. The `repository_dispatch` endpoint itself requires that bearer token to accept the request — an unauthenticated POST is rejected by GitHub, so the trigger path is authenticated end-to-end.
3. A **new, separate, minimally-scoped token** should be created for this GitHub Actions `SANITY_API_TOKEN` — reusing the local verification/migration token is explicitly against binding condition 7 (that one gets revoked once this round of work is approved and done). A CI read token only needs `viewer` role on project `qhrodl8k` (not `editor` — the CI build only reads, never writes).

## Explicitly not done yet (needs separate approval per binding condition 4)

- Creating the actual CI-scoped Sanity token.
- Adding the 4 GitHub repository secrets.
- Editing `.github/workflows/deploy.yml` to add the `repository_dispatch` trigger and `CONTENT_SOURCE: sanity` env var.
- Configuring the webhook in Sanity's dashboard (this is also the point where the site would start actually reading from Sanity in production — the single most consequential step in this whole migration, and the one that most clearly needs its own explicit go-ahead).
