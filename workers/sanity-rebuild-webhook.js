/**
 * Cloudflare Worker: Sanity publish webhook → authenticated GitHub rebuild trigger
 *
 * Not deployed yet — this file exists for review only (plan: GitHub Actions
 * webhook preparation, items 3/4). Deploying it (`wrangler deploy`) and wiring
 * the actual webhook URL into Sanity's dashboard are explicitly separate,
 * later, human-approved steps — see docs/migration/github-actions-webhook-plan.md.
 *
 * Why a Worker and not a direct Sanity-webhook → GitHub-dispatches call:
 * calling GitHub's `repository_dispatch` endpoint directly from Sanity's
 * webhook config only lets GitHub verify a bearer token — it cannot verify
 * that the request body actually came from Sanity (no payload signature
 * check). This Worker sits in between, verifies Sanity's HMAC webhook
 * signature first (same `@sanity/webhook` package/scheme the Studio/Sanity
 * ecosystem uses), and only then calls GitHub, with its own, separately
 * scoped and rotatable GitHub token — never pasted directly into Sanity's
 * UI. This mirrors the existing hno-alici-announcements Worker's pattern
 * (secrets via `wrangler secret put`, never committed).
 *
 * Secrets (set via `wrangler secret put`, never committed):
 *   SANITY_WEBHOOK_SECRET  - shared secret configured identically in Sanity's
 *                            webhook dashboard; used to verify the
 *                            sanity-webhook-signature header.
 *   GITHUB_PAT             - a token with ONLY the "contents: read" +
 *                            "actions: write" (or classic "repo") scope on
 *                            officemymobile-tech/hno-alici-web — used solely
 *                            to call the repository_dispatch endpoint.
 *                            Deliberately separate from the announcements
 *                            Worker's GITHUB_PAT (which has broader
 *                            Contents-API write access) — this one needs
 *                            far less privilege, so it gets far less.
 *
 * Vars (non-secret, in wrangler.toml):
 *   GITHUB_OWNER, GITHUB_REPO, DISPATCH_EVENT_TYPE
 */

import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) {
      return new Response("Missing signature header", { status: 401 });
    }

    // IMPORTANT: verify against the raw request text, not a re-serialized
    // JSON string — re-encoding can change byte-for-byte formatting
    // (whitespace, key order) and break the signature check even for a
    // genuinely valid request. Read the body as text first, parse after.
    const rawBody = await request.text();

    let validSignature = false;
    try {
      validSignature = await isValidSignature(rawBody, signature, env.SANITY_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Signature verification threw:", err);
      return new Response("Signature verification error", { status: 401 });
    }

    if (!validSignature) {
      return new Response("Invalid signature", { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      // Signature was valid but body isn't JSON — reject rather than
      // forward something unparseable as a rebuild trigger.
      return new Response("Invalid payload", { status: 400 });
    }

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const eventType = env.DISPATCH_EVENT_TYPE || "sanity-content-published";

    let githubResponse;
    try {
      githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GITHUB_PAT}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "hno-alici-sanity-rebuild-webhook",
        },
        body: JSON.stringify({
          event_type: eventType,
          // Minimal, non-sensitive context only — never forward the raw
          // Sanity payload (could contain unpublished-looking transition
          // data) into a GitHub Actions log.
          client_payload: {
            documentType: payload?._type ?? "unknown",
            triggeredAt: new Date().toISOString(),
          },
        }),
      });
    } catch (err) {
      // Network-level failure calling GitHub — return 502 so Sanity's own
      // webhook retry/backoff mechanism retries this delivery automatically
      // (Sanity retries non-2xx responses), rather than silently dropping
      // the rebuild request.
      console.error("Failed to reach GitHub dispatches API:", err);
      return new Response("Upstream dispatch failed", { status: 502 });
    }

    if (githubResponse.status === 204) {
      return new Response("OK", { status: 200 });
    }

    // GitHub's dispatches endpoint returns 204 on success and 4xx/5xx with a
    // JSON error body otherwise (e.g. bad token, wrong event_type format,
    // repo not found). Log the detail for debugging, but don't leak it back
    // to the caller (which is Sanity's infra, not a developer).
    const errorDetail = await githubResponse.text().catch(() => "");
    console.error(`GitHub dispatches API returned ${githubResponse.status}:`, errorDetail);
    return new Response("Dispatch to GitHub failed", { status: 502 });
  },
};
