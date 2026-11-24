/**
 * Content-Security-Policy for the public marketing site only (the `[locale]`
 * layout and the `/` redirect stub) — deliberately NOT applied to `/studio/`,
 * which is a third-party Sanity Studio bundle needing a much looser policy.
 *
 * Delivered via <meta http-equiv>, the only mechanism available on a static
 * GitHub Pages export (no server to set a real response header). Per the
 * CSP spec, a meta-delivered policy cannot enforce `frame-ancestors`,
 * `sandbox`, or `report-uri`/`report-to` — browsers silently ignore those
 * directives here, so this is not a substitute for HSTS/X-Frame-Options at
 * the HTTP layer (see SECURITY_REMEDIATION_PLAN.md P3 for the full fix: a
 * reverse proxy/CDN in front of GitHub Pages).
 *
 * `script-src` keeps 'unsafe-inline': Next.js's own App Router hydration
 * bootstrap (`<script id="_R_">`, framework-injected, not our code) is an
 * inline script with no nonce support under a static export, so blocking
 * inline scripts entirely would break client-side hydration (forms, menus,
 * cookie consent) across the whole site. This matches a real, verified
 * constraint of this architecture, not an oversight — confirmed by
 * inspecting the actual `next build` output.
 *
 * `style-src` keeps 'unsafe-inline' too, for the same reason: React's
 * `style={{...}}` prop (used across this codebase for e.g. scroll/visibility
 * transforms) renders as inline `style="..."` attributes, which `style-src`
 * governs independently of `<style>` tags. This was NOT assumed — it was
 * caught by tests/security-headers.spec.ts failing against a stricter
 * policy during this fix, which is why it's called out explicitly here
 * rather than silently dropped.
 *
 * `img-src` includes `https://cdn.sanity.io`: real Sanity-sourced images
 * (doctor/staff portraits, service photos) are served from that CDN once
 * CONTENT_SOURCE=sanity has actual content to render — confirmed the hard
 * way (2026-11-24): every prior check of this codebase found zero Sanity
 * image usage, because no build with complete Sanity data had ever
 * actually run before that date, so this wasn't caught until the first
 * real CONTENT_SOURCE=sanity build broke every image on the site via CSP.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");
