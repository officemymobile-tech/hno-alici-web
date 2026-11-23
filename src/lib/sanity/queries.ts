import { sanityClient } from "./client";
import { urlFor, hotspotPosition } from "./image";
import type { ResolvedSchedule, TimeSlot } from "../opening-hours";

type Loc = { de?: string; tr?: string };
function loc(v: Loc | undefined, fallback: { de: string; tr: string }) {
  return { de: v?.de?.trim() || fallback.de, tr: v?.tr?.trim() || fallback.tr };
}

// ---- siteSettings: contact info (src/lib/site.ts siteConfig) ----
export type SiteSettingsOverlay = {
  name?: string;
  domain?: string;
  phone?: string;
  phoneDisplay?: string;
  email?: string;
  privacyEmail?: string;
  address?: { street?: string; city?: string; zip?: string; country?: string };
  mapsUrl?: string;
  directionsUrl?: string;
  googleReviewsUrl?: string;
  logo?: string;
  socialLinks?: Array<{ platform?: string; url?: string }>;
  defaultOgImage?: string;
};

export async function fetchSiteSettings(): Promise<SiteSettingsOverlay | null> {
  const d = await sanityClient.fetch<
    (Omit<SiteSettingsOverlay, "logo" | "socialLinks" | "defaultOgImage"> & {
      logo?: unknown;
      socialLinks?: Array<{ platform?: string; url?: string }>;
      seo?: { defaultOgImage?: unknown };
    }) | null
  >(
    `*[_id == "siteSettings"][0]{name, domain, phone, phoneDisplay, email, privacyEmail, address, mapsUrl, directionsUrl, googleReviewsUrl, logo, socialLinks, seo}`,
  );
  if (!d) return null;
  return {
    ...d,
    logo: d.logo ? urlFor(d.logo as Parameters<typeof urlFor>[0]).url() : undefined,
    socialLinks: d.socialLinks,
    defaultOgImage: d.seo?.defaultOgImage
      ? urlFor(d.seo.defaultOgImage as Parameters<typeof urlFor>[0]).url()
      : undefined,
  };
}

// ---- siteSettings.pageSeo (per-page SEO overrides for code-only pages) ----
export type PageSeoOverlay = { metaTitle?: Loc; metaDescription?: Loc };

export async function fetchPageSeo(pageKey: string): Promise<PageSeoOverlay | null> {
  // Unlike a top-level `*[_type == "..."]` filter (always an array, even
  // empty), projecting a nested array field off a single document
  // (`[0].pageSeo[]`) returns null when that field is absent on the
  // document — which it currently is, since no pageSeo entries have been
  // added in Studio yet. Found via the fail-closed build test: this `null`
  // was previously masked by the catch-all fallback in page-seo.ts, so
  // `.find()` on it never actually threw where anyone would notice.
  const entries = await sanityClient.fetch<Array<{ pageKey: string; metaTitle?: Loc; metaDescription?: Loc }> | null>(
    `*[_id == "siteSettings"][0].pageSeo[]{pageKey, metaTitle, metaDescription}`,
  );
  return (entries ?? []).find((e) => e.pageKey === pageKey) ?? null;
}

// ---- siteSettings.generalFaq (homepage/patienteninfo general FAQ) ----
export type GeneralFaqOverlay = Array<{ q: { de: string; tr: string }; a: { de: string; tr: string } }>;

export async function fetchGeneralFaq(): Promise<GeneralFaqOverlay> {
  const items = await sanityClient.fetch<Array<{ q?: Loc; a?: Loc }>>(
    `*[_id == "siteSettings"][0].generalFaq[]{q, a}`,
  );
  return (items ?? []).map((f) => ({ q: loc(f.q, { de: "", tr: "" }), a: loc(f.a, { de: "", tr: "" }) }));
}

// ---- siteSettings.editableImages + textOverrides (src/lib/editable-content.ts) ----
export type EditableContentOverlay = {
  images: Record<string, string>;
  // Hotspot-derived CSS object-position per image key (see image.ts's
  // hotspotPosition()) — only present when the editor actually set a focal
  // point in Studio for that image.
  imagePositions: Record<string, string>;
  texts: Record<string, Record<string, { de: string; tr: string }>>;
  team: { staff: Array<{ name: string; role: { de: string; tr: string }; photo?: string; photoPosition?: string }> };
} | null;

export async function fetchEditableContentOverlay(): Promise<EditableContentOverlay> {
  const settings = await sanityClient.fetch<{
    editableImages?: Record<string, unknown>;
    textOverrides?: Array<{ section: string; key: string; value?: Loc }>;
  } | null>(`*[_id == "siteSettings"][0]{editableImages, textOverrides}`);

  const staff = await sanityClient.fetch<
    Array<{ name: string; role?: Loc; active?: boolean; order?: number; photo?: unknown }>
  >(`*[_type == "staffMember" && active != false] | order(order asc){name, role, active, order, photo}`);

  if (!settings && staff.length === 0) return null;

  const images: Record<string, string> = {};
  const imagePositions: Record<string, string> = {};
  if (settings?.editableImages) {
    for (const [key, value] of Object.entries(settings.editableImages)) {
      if (value && typeof value === "object" && "asset" in (value as Record<string, unknown>)) {
        images[key] = urlFor(value as Parameters<typeof urlFor>[0]).url();
        const pos = hotspotPosition(value);
        if (pos) imagePositions[key] = pos;
      }
    }
  }

  const texts: Record<string, Record<string, { de: string; tr: string }>> = {};
  for (const o of settings?.textOverrides ?? []) {
    texts[o.section] ??= {};
    texts[o.section][o.key] = { de: o.value?.de ?? "", tr: o.value?.tr ?? "" };
  }

  return {
    images,
    imagePositions,
    texts,
    team: {
      staff: staff.map((s) => ({
        name: s.name,
        role: loc(s.role, { de: "", tr: "" }),
        photo: s.photo ? urlFor(s.photo as Parameters<typeof urlFor>[0]).url() : undefined,
        photoPosition: hotspotPosition(s.photo),
      })),
    },
  };
}

// ---- announcement (src/lib/announcements.ts) ----
export type AnnouncementOverlay = {
  active: boolean;
  variant: "info" | "warning" | "urgent";
  title: { de: string; tr: string };
  text: { de: string; tr: string };
  link: { url: string; label: { de: string; tr: string } };
  validUntil: string | null;
  updatedAt: string;
} | null;

export async function fetchActiveAnnouncement(): Promise<AnnouncementOverlay> {
  const today = new Date().toISOString().slice(0, 10);
  const doc = await sanityClient.fetch<{
    title?: Loc;
    text?: Loc;
    variant?: string;
    link?: { url?: string; label?: Loc };
    endDate?: string;
    _updatedAt?: string;
  } | null>(
    `*[_type == "announcement" && active == true && (!defined(startDate) || startDate <= $today) && (!defined(endDate) || endDate >= $today)] | order(priority desc)[0]{title, text, variant, link, endDate, _updatedAt}`,
    { today },
  );
  if (!doc) return null;
  return {
    active: true,
    variant: (doc.variant as "info" | "warning" | "urgent") ?? "info",
    title: loc(doc.title, { de: "", tr: "" }),
    text: loc(doc.text, { de: "", tr: "" }),
    link: { url: doc.link?.url ?? "", label: loc(doc.link?.label, { de: "", tr: "" }) },
    validUntil: doc.endDate ?? null,
    updatedAt: doc._updatedAt ?? new Date().toISOString(),
  };
}

// ---- legalDocument (src/content/legal/index.ts) ----
export type LegalDocumentOverlay = {
  title: string;
  updated: string;
  sections: Array<{ id?: string; title: string; paragraphs: string[]; list?: string[] }>;
} | null;

export async function fetchLegalDocument(pageKey: string, locale: string): Promise<LegalDocumentOverlay> {
  const doc = await sanityClient.fetch<{
    title: string;
    updated: string;
    sections?: Array<{ sectionId?: string; title?: string; paragraphs?: string[]; list?: string[] }>;
  } | null>(`*[_type == "legalDocument" && pageKey == $pageKey && locale == $locale][0]{title, updated, sections}`, {
    pageKey,
    locale,
  });
  if (!doc) return null;
  return {
    title: doc.title,
    updated: doc.updated,
    sections: (doc.sections ?? []).map((s) => ({
      id: s.sectionId,
      title: s.title ?? "",
      paragraphs: s.paragraphs ?? [],
      list: s.list,
    })),
  };
}

// ---- service (src/content/seo-services.ts) ----
export type ServiceOverlay = {
  slug: string;
  h1: { de: string; tr: string };
  shortTitle?: { de: string; tr: string };
  cardText?: { de: string; tr: string };
  metaTitle: { de: string; tr: string };
  metaDescription: { de: string; tr: string };
  keywords: { de: string[]; tr: string[] };
  intro: { de: string; tr: string };
  symptoms: { de: string[]; tr: string[] };
  treatments: { de: string[]; tr: string[] };
  faq: { q: { de: string; tr: string }; a: { de: string; tr: string } }[];
  image: string;
  imagePosition?: string;
};

export async function fetchServices(): Promise<ServiceOverlay[]> {
  const docs = await sanityClient.fetch<
    Array<{
      slug: string;
      h1?: Loc;
      shortTitle?: Loc;
      cardText?: Loc;
      metaTitle?: Loc;
      metaDescription?: Loc;
      keywords?: { de?: string[]; tr?: string[] };
      intro?: Loc;
      symptoms?: { de?: string[]; tr?: string[] };
      treatments?: { de?: string[]; tr?: string[] };
      faq?: Array<{ q?: Loc; a?: Loc }>;
      image?: unknown;
    }>
  >(`*[_type == "service"]{slug, h1, shortTitle, cardText, metaTitle, metaDescription, keywords, intro, symptoms, treatments, faq, image}`);

  return docs.map((d) => ({
    slug: d.slug,
    h1: loc(d.h1, { de: "", tr: "" }),
    // Only set when actually populated in Sanity — if left as `{de:"",tr:""}`
    // like every other `loc()`-wrapped field, the content-loader's per-slug
    // merge would overwrite the real local short title/card text with blanks
    // the moment anyone switches CONTENT_SOURCE=sanity, since these 2 fields
    // didn't exist on the 7 already-migrated service documents before this change.
    shortTitle: d.shortTitle?.de ? loc(d.shortTitle, { de: "", tr: "" }) : undefined,
    cardText: d.cardText?.de ? loc(d.cardText, { de: "", tr: "" }) : undefined,
    metaTitle: loc(d.metaTitle, { de: "", tr: "" }),
    metaDescription: loc(d.metaDescription, { de: "", tr: "" }),
    keywords: { de: d.keywords?.de ?? [], tr: d.keywords?.tr ?? [] },
    intro: loc(d.intro, { de: "", tr: "" }),
    symptoms: { de: d.symptoms?.de ?? [], tr: d.symptoms?.tr ?? [] },
    treatments: { de: d.treatments?.de ?? [], tr: d.treatments?.tr ?? [] },
    faq: (d.faq ?? []).map((f) => ({ q: loc(f.q, { de: "", tr: "" }), a: loc(f.a, { de: "", tr: "" }) })),
    image: d.image ? urlFor(d.image as Parameters<typeof urlFor>[0]).url() : "",
    imagePosition: hotspotPosition(d.image),
  }));
}

// ---- blogPost (src/content/seo-landings.ts blogPosts[]) ----
export type BlogPostOverlay = {
  slug: string;
  date: string;
  title: { de: string; tr: string };
  excerpt: { de: string; tr: string };
  content: { de: string; tr: string };
  keywords: string[];
};

export async function fetchBlogPosts(): Promise<BlogPostOverlay[]> {
  const docs = await sanityClient.fetch<
    Array<{
      slug?: { current?: string };
      date: string;
      title?: Loc;
      excerpt?: Loc;
      content?: Loc;
      keywords?: string[];
    }>
  >(`*[_type == "blogPost"] | order(date desc){slug, date, title, excerpt, content, keywords}`);

  return docs
    .filter((d) => d.slug?.current)
    .map((d) => ({
      slug: d.slug!.current!,
      date: d.date,
      title: loc(d.title, { de: "", tr: "" }),
      excerpt: loc(d.excerpt, { de: "", tr: "" }),
      content: loc(d.content, { de: "", tr: "" }),
      keywords: d.keywords ?? [],
    }));
}

// ---- doctor (src/content/doctor-profile.ts) ----
export type DoctorOverlay = {
  name: string;
  portrait?: string;
  portraitPosition?: string;
  tagline: { de: string; tr: string };
  clinicalTitle?: { de: string; tr: string };
  medicalSpecialties?: string[];
  cv: { de: string[]; tr: string[] };
  qualifications: { de: string[]; tr: string[] };
  philosophy: { de: string; tr: string };
  usps: { de: string[]; tr: string[] };
} | null;

// ---- doctor (full list, for the homepage "Doctors Section" — src/content/doctors-list.ts) ----
export type DoctorListEntry = {
  name: string;
  clinicalTitle?: { de: string; tr: string };
  portrait?: string;
  portraitPosition?: string;
  isPrimary: boolean;
};

export async function fetchDoctors(): Promise<DoctorListEntry[]> {
  const docs = await sanityClient.fetch<
    Array<{ name: string; clinicalTitle?: Loc; portrait?: unknown; isPrimary?: boolean }>
  >(`*[_type == "doctor"] | order(isPrimary desc){name, clinicalTitle, portrait, isPrimary}`);
  return docs.map((d) => ({
    name: d.name,
    clinicalTitle: d.clinicalTitle?.de ? loc(d.clinicalTitle, { de: "", tr: "" }) : undefined,
    portrait: d.portrait ? urlFor(d.portrait as Parameters<typeof urlFor>[0]).url() : undefined,
    portraitPosition: hotspotPosition(d.portrait),
    isPrimary: d.isPrimary ?? false,
  }));
}

export async function fetchDoctorProfile(): Promise<DoctorOverlay> {
  const d = await sanityClient.fetch<{
    name: string;
    portrait?: unknown;
    tagline?: Loc;
    clinicalTitle?: Loc;
    medicalSpecialties?: string[];
    cv?: { de?: string[]; tr?: string[] };
    qualifications?: { de?: string[]; tr?: string[] };
    philosophy?: Loc;
    usps?: { de?: string[]; tr?: string[] };
  } | null>(
    `*[_type == "doctor" && isPrimary == true][0]{name, portrait, tagline, clinicalTitle, medicalSpecialties, cv, qualifications, philosophy, usps}`,
  );
  if (!d) return null;
  return {
    name: d.name,
    portrait: d.portrait ? urlFor(d.portrait as Parameters<typeof urlFor>[0]).url() : undefined,
    portraitPosition: hotspotPosition(d.portrait),
    tagline: loc(d.tagline, { de: "", tr: "" }),
    clinicalTitle: d.clinicalTitle?.de ? loc(d.clinicalTitle, { de: "", tr: "" }) : undefined,
    medicalSpecialties: d.medicalSpecialties?.length ? d.medicalSpecialties : undefined,
    cv: { de: d.cv?.de ?? [], tr: d.cv?.tr ?? [] },
    qualifications: { de: d.qualifications?.de ?? [], tr: d.qualifications?.tr ?? [] },
    philosophy: loc(d.philosophy, { de: "", tr: "" }),
    usps: { de: d.usps?.de ?? [], tr: d.usps?.tr ?? [] },
  };
}

// ---- openingHours + closurePeriod (src/lib/opening-hours.ts ResolvedSchedule) ----
const DAY_TO_NUMBER: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

function parseTime(hhmm: string): [number, number] {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return [h || 0, m || 0];
}

function toTimeSlots(windows?: Array<{ opens?: string; closes?: string }>): TimeSlot[] {
  return (windows ?? [])
    .filter((w) => w.opens && w.closes)
    .map((w) => {
      const [startHour, startMinute] = parseTime(w.opens!);
      const [endHour, endMinute] = parseTime(w.closes!);
      return { startHour, startMinute, endHour, endMinute };
    });
}

export async function fetchOpeningHoursOverlay(): Promise<ResolvedSchedule | null> {
  const doc = await sanityClient.fetch<{
    weekdays?: Array<{ day: string; windows?: Array<{ opens?: string; closes?: string }> }>;
    specialDays?: Array<{ date: string; windows?: Array<{ opens?: string; closes?: string }>; note?: Loc }>;
  } | null>(`*[_id == "openingHours"][0]{weekdays, specialDays}`);
  if (!doc?.weekdays?.length) return null;

  const closurePeriods = await sanityClient.fetch<Array<{ startDate: string; endDate: string; reason?: Loc }>>(
    `*[_type == "closurePeriod" && active == true]{startDate, endDate, reason}`,
  );

  const weekdays: Record<number, TimeSlot[]> = {};
  for (const w of doc.weekdays) {
    const dayNum = DAY_TO_NUMBER[w.day];
    if (dayNum === undefined) continue;
    weekdays[dayNum] = toTimeSlots(w.windows);
  }

  return {
    weekdays,
    specialDays: (doc.specialDays ?? []).map((s) => ({
      date: s.date,
      windows: toTimeSlots(s.windows),
      note: s.note ? loc(s.note, { de: "", tr: "" }) : undefined,
    })),
    closurePeriods: closurePeriods.map((c) => ({
      startDate: c.startDate,
      endDate: c.endDate,
      reason: c.reason ? loc(c.reason, { de: "", tr: "" }) : undefined,
    })),
  };
}

// ---- reviewPlatform + patientReview (src/content/reviews.ts) ----
export type ReviewPlatformOverlay = {
  id: string;
  name: string;
  rating: number;
  maxRating: number;
  reviewCount: number;
  url: string;
  writeReviewUrl?: string;
};

export async function fetchReviewPlatforms(): Promise<ReviewPlatformOverlay[]> {
  const docs = await sanityClient.fetch<
    Array<{ _id: string; name: string; rating: number; maxRating?: number; reviewCount: number; url: string; writeReviewUrl?: string }>
  >(`*[_type == "reviewPlatform"]{_id, name, rating, maxRating, reviewCount, url, writeReviewUrl}`);
  return docs.map((d) => ({
    id: d.name.toLowerCase(),
    name: d.name,
    rating: d.rating,
    maxRating: d.maxRating ?? 5,
    reviewCount: d.reviewCount,
    url: d.url,
    writeReviewUrl: d.writeReviewUrl,
  }));
}

export type PatientReviewOverlay = {
  id: string;
  rating: number;
  title: { de: string; tr: string };
  text: { de: string; tr: string };
  author: string;
  source: "google" | "docfinder" | "herold";
  originalLocale?: string;
};

export async function fetchPatientReviews(): Promise<PatientReviewOverlay[]> {
  const docs = await sanityClient.fetch<
    Array<{
      _id: string;
      rating: number;
      title?: Loc;
      text?: Loc;
      author: string;
      source: "google" | "docfinder" | "herold";
      originalLocale?: string;
    }>
  >(`*[_type == "patientReview" && active != false] | order(order asc){_id, rating, title, text, author, source, originalLocale}`);
  return docs.map((d) => ({
    id: d._id,
    rating: d.rating,
    title: loc(d.title, { de: "", tr: "" }),
    text: loc(d.text, { de: "", tr: "" }),
    author: d.author,
    source: d.source,
    originalLocale: d.originalLocale,
  }));
}

// ---- landingPage (src/content/seo-landings.ts seoLandings) ----
export type LandingPageOverlay = {
  slugKey: "turkishHno" | "kinderHno";
  title: { de: string; tr: string };
  h1: { de: string; tr: string };
  metaDescription: { de: string; tr: string };
  keywords: string[];
  hero: { de: string; tr: string };
  benefits: { de: string[]; tr: string[] };
};

export async function fetchLandingPages(): Promise<LandingPageOverlay[]> {
  const docs = await sanityClient.fetch<
    Array<{
      slugKey: "turkishHno" | "kinderHno";
      title?: Loc;
      h1?: Loc;
      metaDescription?: Loc;
      keywords?: string[];
      hero?: Loc;
      benefits?: { de?: string[]; tr?: string[] };
    }>
  >(`*[_type == "landingPage"]{slugKey, title, h1, metaDescription, keywords, hero, benefits}`);
  return docs.map((d) => ({
    slugKey: d.slugKey,
    title: loc(d.title, { de: "", tr: "" }),
    h1: loc(d.h1, { de: "", tr: "" }),
    metaDescription: loc(d.metaDescription, { de: "", tr: "" }),
    keywords: d.keywords ?? [],
    hero: loc(d.hero, { de: "", tr: "" }),
    benefits: { de: d.benefits?.de ?? [], tr: d.benefits?.tr ?? [] },
  }));
}
