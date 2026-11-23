import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";
import { blogPosts } from "@/content/seo-landings";
import { serviceSlugs } from "@/lib/site";

const baseUrl = "https://hno-alici.at";

const staticPaths = [
  "",
  "/team",
  "/dr-uemit-alici",
  "/dr-uemit-alici/lebenslauf",
  "/dr-uemit-alici/qualifikationen",
  "/dr-uemit-alici/philosophie",
  "/leistungen",
  "/patienteninfo",
  "/bewertungen",
  "/kontakt",
  "/termin",
  "/blog",
  "/impressum",
  "/datenschutz",
  "/cookie-richtlinie",
  "/haftungsausschluss",
  "/tuerkischer-hno-arzt-wien",
  "/turk-kbb-doktoru-wien",
  "/kinder-hno-wien-1100",
  "/cocuk-kbb-wien-1100",
];

// The 4 locale-exclusive landing pages don't have a same-path counterpart in
// the other locale (/de/tuerkischer-hno-arzt-wien's real alternate is
// /tr/turk-kbb-doktoru-wien, a different path) — same cross-mapping already
// used by each page's own generateMetadata (Phase 2/3 hreflang fix).
// Every other path is the same under both locales. This mirrors that
// mapping at the sitemap level (Google supports hreflang annotations
// directly in sitemaps via `alternates.languages`; this was previously
// only declared per-page in the HTML <head>, never here).
const crossLocalePath: Record<string, string> = {
  "/tuerkischer-hno-arzt-wien": "/turk-kbb-doktoru-wien",
  "/turk-kbb-doktoru-wien": "/tuerkischer-hno-arzt-wien",
  "/kinder-hno-wien-1100": "/cocuk-kbb-wien-1100",
  "/cocuk-kbb-wien-1100": "/kinder-hno-wien-1100",
};

function languageAlternates(path: string) {
  // For a tr-exclusive path (e.g. /turk-kbb-doktoru-wien), the German
  // alternate is the cross-mapped path; for a de-exclusive or shared path,
  // the German alternate is the path itself (and vice versa for tr).
  const isTrExclusive = path === "/turk-kbb-doktoru-wien" || path === "/cocuk-kbb-wien-1100";
  const dePart = isTrExclusive ? crossLocalePath[path] : path;
  const trPart = isTrExclusive ? path : (crossLocalePath[path] ?? path);
  return {
    "de-AT": `${baseUrl}/de${dePart}/`,
    "tr-AT": `${baseUrl}/tr${trPart}/`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      if (path === "/tuerkischer-hno-arzt-wien" && locale === "tr") continue;
      if (path === "/turk-kbb-doktoru-wien" && locale === "de") continue;
      if (path === "/kinder-hno-wien-1100" && locale === "tr") continue;
      if (path === "/cocuk-kbb-wien-1100" && locale === "de") continue;

      entries.push({
        url: `${baseUrl}/${locale}${path}/`,
        lastModified: new Date(),
        changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.includes("hno") || path.includes("kbb") ? 0.9 : 0.8,
        alternates: { languages: languageAlternates(path) },
      });
    }

    for (const slug of serviceSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/leistungen/${slug}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.85,
        alternates: {
          languages: {
            "de-AT": `${baseUrl}/de/leistungen/${slug}/`,
            "tr-AT": `${baseUrl}/tr/leistungen/${slug}/`,
          },
        },
      });
    }

    for (const post of blogPosts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}/`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            "de-AT": `${baseUrl}/de/blog/${post.slug}/`,
            "tr-AT": `${baseUrl}/tr/blog/${post.slug}/`,
          },
        },
      });
    }
  }

  return entries;
}
