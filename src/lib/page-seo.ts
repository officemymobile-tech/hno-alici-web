import { isSanityContentEnabled, sanityReadFailed } from "./content-source";
import { fetchPageSeo } from "./sanity/queries";

export type PageSeoFallback = { title: string; description: string };

/**
 * Per-page SEO override for pages that have no dedicated Sanity document of
 * their own (team, kontakt, leistungen overview, patienteninfo, bewertungen,
 * termin, the 4 legal pages, the doctor-profile page tree) — reads
 * siteSettings.pageSeo[pageKey], falling back to the exact title/description
 * each page's own generateMetadata already computed (the already-correct,
 * bug-fixed values from an earlier session's duplicate-title fix), so this
 * is purely additive: nothing changes unless an editor actually sets an
 * override in Studio.
 */
export async function getPageSeo(pageKey: string, locale: "de" | "tr", fallback: PageSeoFallback): Promise<PageSeoFallback> {
  if (!isSanityContentEnabled()) return fallback;
  try {
    const overlay = await fetchPageSeo(pageKey);
    if (!overlay) return fallback;
    return {
      title: overlay.metaTitle?.[locale]?.trim() || fallback.title,
      description: overlay.metaDescription?.[locale]?.trim() || fallback.description,
    };
  } catch (e) {
    sanityReadFailed(`page-seo (${pageKey})`, e);
  }
}
