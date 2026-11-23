import raw from "@/content/site-editable.json";
import type { Locale } from "@/i18n/routing";
import { isSanityContentEnabled, sanityReadFailed } from "./content-source";
import { fetchEditableContentOverlay } from "./sanity/queries";

export type LocalizedString = { de: string; tr: string };

export type EditableContent = {
  updatedAt: string;
  texts: Record<string, Record<string, LocalizedString>>;
  images: Record<string, string>;
  // CSS object-position per image key, from that image's Sanity hotspot —
  // absent for the local JSON (no hotspot concept there) and for any Sanity
  // image whose editor never set a focal point.
  imagePositions: Record<string, string>;
  team: {
    staff: Array<{ name: string; role: LocalizedString; photo?: string; photoPosition?: string }>;
  };
};

const localData = raw as Omit<EditableContent, "imagePositions">;

// Resolved once at build time (top-level await — see plan Section 4.3). Every
// function below is unchanged and synchronous, so every existing call site
// (Hero.tsx, AboutPreview.tsx, HoursCard.tsx, team/page.tsx, ...) needed zero
// edits. Falls back to the local JSON on any Sanity error or when
// CONTENT_SOURCE isn't "sanity" (binding condition 3: local stays
// authoritative for the production build, which never sets that variable).
let data: EditableContent = { ...localData, imagePositions: {} };
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchEditableContentOverlay();
    if (!overlay) {
      sanityReadFailed("editable-content (siteSettings singleton missing)", new Error("fetchEditableContentOverlay returned null"));
    }
    const texts: EditableContent["texts"] = {};
    for (const section of new Set([...Object.keys(localData.texts), ...Object.keys(overlay.texts)])) {
      texts[section] = { ...localData.texts[section], ...overlay.texts[section] };
    }
    data = {
      updatedAt: localData.updatedAt,
      images: { ...localData.images, ...overlay.images },
      imagePositions: overlay.imagePositions,
      texts,
      team: overlay.team.staff.length ? overlay.team : localData.team,
    };
  } catch (e) {
    sanityReadFailed("editable-content", e);
  }
}

export function getEditableContent(): EditableContent {
  return data;
}

export function getEditableText(
  section: string,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  const value = data.texts?.[section]?.[key]?.[locale]?.trim();
  return value || fallback;
}

export function getEditableImage(key: string, fallback: string): string {
  const value = data.images?.[key]?.trim();
  return value || fallback;
}

/** Companion to getEditableImage() — the CSS object-position for that same
 * key's hotspot, or undefined (meaning: keep the existing fixed crop). */
export function getEditableImagePosition(key: string): string | undefined {
  return data.imagePositions?.[key];
}

export function getEditableTeamStaff(
  fallback: ReadonlyArray<{ name: string; role: LocalizedString; photo?: string; photoPosition?: string }>,
) {
  const staff = data.team?.staff;
  if (!staff?.length) return [...fallback];
  return staff;
}

export const editableImageKeys = [
  "ordinationHero",
  "drAliciPortrait",
  "drMeierPortrait",
  "teamFrAlici",
  "leistungenOverview",
  "homeServiceCardAllgemeineHno",
  "homeServiceCardKinderHno",
  "homeServiceCardHoertest",
  "homeServiceCardAllergologie",
  "leistungenPageAllgemeineHno",
  "leistungenPageKinderHno",
  "leistungenPageAllergologie",
] as const;

export type EditableImageKey = (typeof editableImageKeys)[number];

export const editableImageLabels: Record<
  EditableImageKey,
  { de: string; tr: string; hint: string }
> = {
  ordinationHero: {
    de: "Startseite — Hintergrundfoto",
    tr: "Ana sayfa — arka plan",
    hint: "Breites Querformat, mind. 1600 px",
  },
  drAliciPortrait: {
    de: "Porträt Dr. Ümit Alici",
    tr: "Dr. Ümit Alici portresi",
    hint: "Hochformat, mind. 800 px",
  },
  drMeierPortrait: {
    de: "Porträt Dr. Sigrid Meier",
    tr: "Dr. Sigrid Meier portresi",
    hint: "Hochformat, mind. 800 px",
  },
  teamFrAlici: {
    de: "Team-Foto Ordination",
    tr: "Ekip fotoğrafı",
    hint: "Querformat empfohlen",
  },
  leistungenOverview: {
    de: "Leistungen — Übersichtsbild",
    tr: "Hizmetler — genel görsel",
    hint: "Querformat empfohlen",
  },
  homeServiceCardAllgemeineHno: {
    de: "Startseite — Vorschaukarte: Allgemeine HNO",
    tr: "Ana sayfa — kart: Genel KBB",
    hint: "Querformat 4:3, unabhängig von den anderen 3 Vorschaukarten",
  },
  homeServiceCardKinderHno: {
    de: "Startseite — Vorschaukarte: Kinder-HNO",
    tr: "Ana sayfa — kart: Çocuk KBB",
    hint: "Querformat 4:3, unabhängig von den anderen 3 Vorschaukarten",
  },
  homeServiceCardHoertest: {
    de: "Startseite — Vorschaukarte: Hörtest",
    tr: "Ana sayfa — kart: İşitme testi",
    hint: "Querformat 4:3, unabhängig von den anderen 3 Vorschaukarten",
  },
  homeServiceCardAllergologie: {
    de: "Startseite — Vorschaukarte: Allergologie",
    tr: "Ana sayfa — kart: Alerji",
    hint: "Querformat 4:3, unabhängig von den anderen 3 Vorschaukarten",
  },
  leistungenPageAllgemeineHno: {
    de: "Leistungen-Seite — Bild: Allgemeine HNO Untersuchungen",
    tr: "Hizmetler sayfası — görsel: Genel KBB Muayeneleri",
    hint: "Hochformat 4:5, unabhängig von der gleichnamigen Startseite-Karte",
  },
  leistungenPageKinderHno: {
    de: "Leistungen-Seite — Bild: Kinder HNO",
    tr: "Hizmetler sayfası — görsel: Çocuk KBB",
    hint: "Hochformat 4:5, unabhängig von der gleichnamigen Startseite-Karte",
  },
  leistungenPageAllergologie: {
    de: "Leistungen-Seite — Bild: Allergieabklärung",
    tr: "Hizmetler sayfası — görsel: Alerji Araştırması",
    hint: "Hochformat 4:5, unabhängig von der gleichnamigen Startseite-Karte",
  },
};
