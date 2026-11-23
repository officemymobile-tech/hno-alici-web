import raw from "@/content/announcements.json";
import type { Locale } from "@/i18n/routing";
import { isSanityContentEnabled, sanityReadFailed } from "./content-source";
import { fetchActiveAnnouncement } from "./sanity/queries";

export type AnnouncementVariant = "info" | "warning" | "urgent";

export interface AnnouncementData {
  active: boolean;
  variant: AnnouncementVariant;
  title: { de: string; tr: string };
  text: { de: string; tr: string };
  link: {
    url: string;
    label: { de: string; tr: string };
  };
  validUntil: string | null;
  updatedAt: string;
}

const localData = raw as AnnouncementData;

// Resolved once at build time — see editable-content.ts for the pattern and
// rationale (plan Section 4.3 / binding condition 3). `null` here just means
// "no Sanity announcement document is currently active," which is different
// from "Sanity is unreachable" (that's the catch block, which falls back to
// the local file instead).
let data: AnnouncementData = localData;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchActiveAnnouncement();
    if (overlay) data = overlay;
    else data = { ...localData, active: false };
  } catch (e) {
    sanityReadFailed("announcements", e);
  }
}

function isStillValid(validUntil: string | null): boolean {
  if (!validUntil) return true;
  const end = new Date(`${validUntil}T23:59:59`);
  return !Number.isNaN(end.getTime()) && end >= new Date();
}

function hasContent(locale: Locale, announcement: AnnouncementData): boolean {
  const title = announcement.title[locale]?.trim();
  const text = announcement.text[locale]?.trim();
  return Boolean(title || text);
}

export function getActiveAnnouncement(locale: Locale): AnnouncementData | null {
  if (!data.active || !isStillValid(data.validUntil)) return null;
  if (!hasContent(locale, data)) return null;
  return data;
}
