import { getLocale } from "next-intl/server";
import { getActiveAnnouncement } from "@/lib/announcements";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";

export async function SiteHeader() {
  const locale = (await getLocale()) as Locale;
  const announcement = getActiveAnnouncement(locale);

  return <Header announcement={announcement} />;
}
