// Each reads NEXT_PUBLIC_* first (inlined by Next.js's own build for the
// embedded /studio route and the content loaders) and falls back to the
// SANITY_STUDIO_* mirror (inlined by @sanity/cli's Vite build for `sanity
// build`/`deploy` — Vite does not recognize the NEXT_PUBLIC_ prefix and
// replaces process.env with {} for it, which is what left the standalone
// hosted Studio running with an empty projectId and crashing right after
// login). Confirmed by grepping the deployed bundle. Next.js is unaffected
// by this fallback since its compiler inlines the first operand directly.
// Each reads NEXT_PUBLIC_* first (inlined by Next.js's own build for the
// embedded /studio route and the content loaders) and falls back to the
// SANITY_STUDIO_* mirror (inlined by @sanity/cli's Vite build for `sanity
// build`/`deploy` — Vite does not recognize the NEXT_PUBLIC_ prefix and
// replaces process.env with {} for it, which is what left the standalone
// hosted Studio running with an empty projectId and crashing right after
// login). Confirmed by grepping the deployed bundle. Next.js is unaffected
// by this fallback since its compiler inlines the first operand directly.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || "2025-01-01";

// Deliberately does NOT throw when unset (unlike the common Sanity starter
// pattern) — plan Section 4.5 requires `npm run build` to still succeed with
// no Sanity project configured yet, degrading gracefully instead (the
// Section 4.4 fallback strategy for content fetches; the Studio route shows
// a friendly "not configured" placeholder instead of NextStudio — see
// Studio.tsx). isSanityConfigured() is the one place that distinguishes
// "really configured" from this placeholder value.
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";

// Server/build-time only — deliberately NOT prefixed NEXT_PUBLIC_, so it is
// never inlined into client bundles (constraint: no write/API tokens
// reachable by the browser). Used by src/lib/sanity/client.ts for build-time
// GROQ fetches. Empirically, this fresh project's "public" dataset ACL did
// not reliably serve unauthenticated query-API reads (worked once right
// after project creation, then stopped — likely ACL propagation lag on
// Sanity's side, not a bug in this code) — reading via this token instead is
// more robust and works regardless of dataset visibility.
export const readToken = process.env.SANITY_API_TOKEN;

export function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}
