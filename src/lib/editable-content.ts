import raw from "@/content/site-editable.json";
import type { Locale } from "@/i18n/routing";

export type LocalizedString = { de: string; tr: string };

export type EditableContent = {
  updatedAt: string;
  texts: Record<string, Record<string, LocalizedString>>;
  images: Record<string, string>;
  team: {
    staff: Array<{ name: string; role: LocalizedString }>;
  };
};

const data = raw as EditableContent;

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

export function getEditableTeamStaff(
  fallback: ReadonlyArray<{ name: string; role: LocalizedString }>,
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
};
