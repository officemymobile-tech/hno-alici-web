/**
 * Source-of-truth switch for CMS-backed content (plan Section 3 / user
 * binding condition 3): unset or any value other than "sanity" keeps every
 * content loader on the existing local JSON/TS files — this is what the
 * production GitHub Actions workflow does today, since it never sets this
 * variable. Only an explicit local CONTENT_SOURCE=sanity opts a local build
 * into reading from the live Sanity project. This is a build-time-only
 * switch (read via process.env at module-eval time during `next build`),
 * never a runtime/client toggle, so it stays compatible with
 * `output: "export"`.
 */
export function isSanityContentEnabled(): boolean {
  return process.env.CONTENT_SOURCE === "sanity";
}

/**
 * Fail-closed guard (production go-live binding condition): when
 * CONTENT_SOURCE=sanity, a failed or invalid Sanity read must abort the
 * build, never silently fall back to local content. The CONTENT_SOURCE-unset
 * path is unaffected — it never calls this, local content stays the
 * explicit rollback mode. Throwing (not logging+continuing) is what actually
 * fails a Next.js static-export build at the page/module level.
 */
export function sanityReadFailed(context: string, error: unknown): never {
  const detail = error instanceof Error ? error.message : String(error);
  throw new Error(
    `[sanity] FAIL-CLOSED: required content "${context}" could not be read from Sanity while CONTENT_SOURCE=sanity — aborting build instead of silently serving stale/local content. Underlying error: ${detail}`,
  );
}
