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
      });
    }

    for (const slug of serviceSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/leistungen/${slug}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }

    for (const post of blogPosts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}/`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
