import raw from "@/content/announcements.json";
import type { Locale } from "@/i18n/routing";

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

const data = raw as AnnouncementData;

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

export function getAnnouncementForAdmin(): AnnouncementData {
  return data;
}
