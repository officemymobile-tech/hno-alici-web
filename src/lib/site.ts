import { isSanityContentEnabled, sanityReadFailed } from "./content-source";
import { fetchSiteSettings } from "./sanity/queries";

const localSiteConfig = {
  name: "Dr. Ümit Alici",
  domain: "https://hno-alici.at",
  phone: "+4316025400",
  phoneDisplay: "+43 1 6025400",
  email: "ordination@hno-alici.at",
  address: {
    street: "Senefeldergasse 3/1",
    city: "Wien",
    zip: "1100",
    country: "AT",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Senefeldergasse+3/1,+1100+Wien,+Austria",
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
  privacyEmail: "datenschutz@hno-alici.at",
  logo: undefined as string | undefined,
  socialLinks: [{ platform: "Facebook", url: "https://de-de.facebook.com/HNO.ALICI/" }],
  defaultOgImage: undefined as string | undefined,
};

// Resolved once at build time — same pattern as editable-content.ts. Dropped
// `as const` since the overlay values are plain runtime strings; nothing
// elsewhere in the codebase relies on siteConfig's fields being literal
// types (checked: every consumer just reads the values).
export let siteConfig = localSiteConfig;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchSiteSettings();
    if (!overlay) {
      sanityReadFailed("site.ts siteConfig (siteSettings singleton missing)", new Error("fetchSiteSettings returned null"));
    }
    siteConfig = {
      name: overlay.name || localSiteConfig.name,
      domain: overlay.domain || localSiteConfig.domain,
      phone: overlay.phone || localSiteConfig.phone,
      phoneDisplay: overlay.phoneDisplay || localSiteConfig.phoneDisplay,
      email: overlay.email || localSiteConfig.email,
      address: { ...localSiteConfig.address, ...overlay.address },
      mapsUrl: overlay.mapsUrl || localSiteConfig.mapsUrl,
      directionsUrl: overlay.directionsUrl || localSiteConfig.directionsUrl,
      googleReviewsUrl: overlay.googleReviewsUrl || localSiteConfig.googleReviewsUrl,
      privacyEmail: overlay.privacyEmail || localSiteConfig.privacyEmail,
      logo: overlay.logo || localSiteConfig.logo,
      socialLinks: overlay.socialLinks?.length
        ? overlay.socialLinks.filter((l): l is { platform: string; url: string } => Boolean(l.platform && l.url))
        : localSiteConfig.socialLinks,
      defaultOgImage: overlay.defaultOgImage || localSiteConfig.defaultOgImage,
    };
  } catch (e) {
    sanityReadFailed("site.ts siteConfig", e);
  }
}

export const serviceSlugs = [
  "allgemeine-hno",
  "kinder-hno",
  "allergologie",
  "hoertest",
  "schwindel",
  "schnarchen",
  "stimmstoerungen",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceSlugToKey: Record<
  ServiceSlug,
  keyof typeof import("../../messages/de.json")["services"]
> = {
  "allgemeine-hno": "general",
  "kinder-hno": "children",
  allergologie: "allergy",
  hoertest: "hearing",
  schwindel: "vertigo",
  schnarchen: "snoring",
  stimmstoerungen: "voice",
};
