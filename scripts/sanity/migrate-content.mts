// Phase 4.1a content/image migration — reads the CURRENT LOCAL source files
// (not Sanity: CONTENT_SOURCE is intentionally left unset in this script's
// own process, so every `@/...` import below resolves to its local value,
// never a round-trip through Sanity) and pushes them into the Sanity project
// as documents with FIXED, deterministic _id values, using createOrReplace —
// re-running this script updates the same documents in place rather than
// creating duplicates (binding condition 2: "wiederholbar ohne doppelte
// Dokumente"). No content is paraphrased or invented; every field is copied
// 1:1 from its local source.
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

process.loadEnvFile(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_API_TOKEN!;
if (!projectId || !token) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

// ---- local content (CONTENT_SOURCE unset => these are all local values) ----
const { siteConfig } = await import("../../src/lib/site");
const { doctorProfile } = await import("../../src/content/doctor-profile");
const { seoServices } = await import("../../src/content/seo-services");
const { blogPosts } = await import("../../src/content/seo-landings");
const rawEditable = (await import("../../src/content/site-editable.json")).default as {
  texts: Record<string, Record<string, { de: string; tr: string }>>;
  images: Record<string, string>;
  team: { staff: Array<{ name: string; role: { de: string; tr: string } }> };
};
const rawAnnouncement = (await import("../../src/content/announcements.json")).default as {
  active: boolean;
  variant: string;
  title: { de: string; tr: string };
  text: { de: string; tr: string };
  link: { url: string; label: { de: string; tr: string } };
  validUntil: string | null;
};
const { clinicSchedule } = await import("../../src/lib/opening-hours");
const { privacyDe } = await import("../../src/content/legal/privacy-de");
const { privacyTr } = await import("../../src/content/legal/privacy-tr");
const { cookiesDe } = await import("../../src/content/legal/cookies-de");
const { cookiesTr } = await import("../../src/content/legal/cookies-tr");
const { impressumDe } = await import("../../src/content/legal/impressum-de");
const { impressumTr } = await import("../../src/content/legal/impressum-tr");
const { haftungDe } = await import("../../src/content/legal/haftung-de");
const { haftungTr } = await import("../../src/content/legal/haftung-tr");

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: "a", ö: "o", ü: "u", ß: "ss" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const report: string[] = [];
function log(line: string) {
  console.log(line);
  report.push(line);
}

// ---- 1. Upload images once, build a path -> asset reference map ----
const imagePaths = [
  "ordination-hero-pro.jpg",
  "dr-alici-portrait-pro.jpg",
  "dr-meier-pro.jpg",
  "team-fr-alici-pro.jpg",
  "leistungen-overview-pro.jpg",
  "leistungen-foto-09-pro.jpg",
  "leistungen-foto-10-pro.jpg",
];
const assetMap: Record<string, string> = {};
log("=== 1. Uploading images (Sanity dedupes identical files by hash) ===");
for (const file of imagePaths) {
  const path = join("public/images/pro", file);
  const buffer = readFileSync(path);
  const asset = await client.assets.upload("image", buffer, { filename: file });
  assetMap[file] = asset._id;
  log(`  ${file} -> ${asset._id}`);
}
writeFileSync(
  "docs/migration/image-asset-map.json",
  JSON.stringify(
    Object.fromEntries(Object.entries(assetMap).map(([k, v]) => [`/images/pro/${k}`, v])),
    null,
    2,
  ) + "\n",
);
const ref = (file: string) => ({ _type: "image" as const, asset: { _type: "reference" as const, _ref: assetMap[file] } });

// ---- 2. siteSettings (contact info + editableImages + textOverrides) ----
log("\n=== 2. siteSettings ===");
const textOverrides = Object.entries(rawEditable.texts).flatMap(([section, keys]) =>
  Object.entries(keys).map(([key, value]) => ({ _key: `${section}-${key}`, section, key, value })),
);
await client.createOrReplace({
  _id: "siteSettings",
  _type: "siteSettings",
  name: siteConfig.name,
  domain: siteConfig.domain,
  phone: siteConfig.phone,
  phoneDisplay: siteConfig.phoneDisplay,
  email: siteConfig.email,
  privacyEmail: siteConfig.privacyEmail,
  address: siteConfig.address,
  mapsUrl: siteConfig.mapsUrl,
  directionsUrl: siteConfig.directionsUrl,
  googleReviewsUrl: siteConfig.googleReviewsUrl,
  editableImages: {
    ordinationHero: ref("ordination-hero-pro.jpg"),
    drAliciPortrait: ref("dr-alici-portrait-pro.jpg"),
    drMeierPortrait: ref("dr-meier-pro.jpg"),
    teamFrAlici: ref("team-fr-alici-pro.jpg"),
    leistungenOverview: ref("leistungen-overview-pro.jpg"),
  },
  textOverrides,
});
log("  siteSettings migrated.");

// ---- 3. staffMember ----
log("\n=== 3. staffMember ===");
for (const [i, member] of rawEditable.team.staff.entries()) {
  const id = `staffMember.${slugify(member.name)}`;
  await client.createOrReplace({
    _id: id,
    _type: "staffMember",
    name: member.name,
    role: member.role,
    order: i,
    active: true,
  });
  log(`  ${id}`);
}

// ---- 4. openingHours (singleton) ----
log("\n=== 4. openingHours ===");
const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
await client.createOrReplace({
  _id: "openingHours",
  _type: "openingHours",
  weekdays: dayKeys.map((day, i) => ({
    _key: day,
    day,
    windows: (clinicSchedule[i] ?? []).map((w, wi) => ({
      _key: `w${wi}`,
      opens: `${String(w.startHour).padStart(2, "0")}:${String(w.startMinute).padStart(2, "0")}`,
      closes: `${String(w.endHour).padStart(2, "0")}:${String(w.endMinute).padStart(2, "0")}`,
    })),
  })),
  specialDays: [],
});
log("  openingHours migrated (from src/lib/opening-hours.ts's clinicSchedule — the clinic's own approved hours).");

// ---- 5. announcement ----
log("\n=== 5. announcement ===");
await client.createOrReplace({
  _id: "announcement.default",
  _type: "announcement",
  title: rawAnnouncement.title,
  text: rawAnnouncement.text,
  variant: rawAnnouncement.variant,
  priority: 0,
  endDate: rawAnnouncement.validUntil ?? undefined,
  link: rawAnnouncement.link.url ? rawAnnouncement.link : undefined,
  active: rawAnnouncement.active,
});
log("  announcement.default migrated.");

// ---- 6. closurePeriod ----
log("\n=== 6. closurePeriod ===");
log("  No active vacation/closure data exists in the local source (announcements.json has no vacation entry) — nothing to migrate.");

// ---- 7. service ----
log("\n=== 7. service ===");
const imageFileFor: Record<string, string> = {
  "allgemeine-hno": "leistungen-foto-09-pro.jpg",
  "kinder-hno": "leistungen-overview-pro.jpg",
  allergologie: "leistungen-foto-10-pro.jpg",
  hoertest: "leistungen-foto-09-pro.jpg",
  schwindel: "leistungen-foto-10-pro.jpg",
  schnarchen: "leistungen-foto-10-pro.jpg",
  stimmstoerungen: "dr-alici-portrait-pro.jpg",
};
for (const [slug, svc] of Object.entries(seoServices)) {
  const id = `service.${slug}`;
  await client.createOrReplace({
    _id: id,
    _type: "service",
    slug,
    h1: svc.h1,
    metaTitle: svc.metaTitle,
    metaDescription: svc.metaDescription,
    keywords: svc.keywords,
    intro: svc.intro,
    symptoms: svc.symptoms,
    treatments: svc.treatments,
    faq: svc.faq.map((f, i) => ({ _key: `faq${i}`, ...f })),
    image: ref(imageFileFor[slug]),
  });
  log(`  ${id}`);
}

// ---- 8. blogPost ----
log("\n=== 8. blogPost ===");
for (const post of blogPosts) {
  const id = `blogPost.${post.slug}`;
  await client.createOrReplace({
    _id: id,
    _type: "blogPost",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    keywords: [...post.keywords],
  });
  log(`  ${id}`);
}

// ---- 9. doctor ----
log("\n=== 9. doctor ===");
await client.createOrReplace({
  _id: "doctor.dr-uemit-alici",
  _type: "doctor",
  name: doctorProfile.name,
  isPrimary: true,
  portrait: ref("dr-alici-portrait-pro.jpg"),
  tagline: doctorProfile.tagline,
  cv: doctorProfile.cv,
  qualifications: doctorProfile.qualifications,
  philosophy: doctorProfile.philosophy,
  usps: doctorProfile.usps,
});
log("  doctor.dr-uemit-alici migrated.");

// ---- 10. legalDocument (verbatim — binding condition: wording not altered) ----
log("\n=== 10. legalDocument (verbatim text copy, no rewording) ===");
const legalDocs: Array<[string, string, unknown]> = [
  ["privacy", "de", privacyDe],
  ["privacy", "tr", privacyTr],
  ["cookies", "de", cookiesDe],
  ["cookies", "tr", cookiesTr],
  ["impressum", "de", impressumDe],
  ["impressum", "tr", impressumTr],
  ["haftung", "de", haftungDe],
  ["haftung", "tr", haftungTr],
];
for (const [pageKey, locale, doc] of legalDocs) {
  const d = doc as { title: string; updated: string; sections: Array<{ id?: string; title: string; paragraphs: string[]; list?: string[] }> };
  const id = `legalDocument.${pageKey}.${locale}`;
  await client.createOrReplace({
    _id: id,
    _type: "legalDocument",
    pageKey,
    locale,
    title: d.title,
    updated: d.updated,
    sections: d.sections.map((s, i) => ({
      _key: s.id ?? `s${i}`,
      sectionId: s.id,
      title: s.title,
      paragraphs: s.paragraphs,
      list: s.list,
    })),
  });
  log(`  ${id} (${d.sections.length} sections, verbatim)`);
}

writeFileSync("docs/migration/migration-run-log.txt", report.join("\n") + "\n");
log("\nMIGRATION COMPLETE. Report written to docs/migration/migration-run-log.txt and docs/migration/image-asset-map.json.");
