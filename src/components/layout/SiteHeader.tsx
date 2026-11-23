import { getLocale } from "next-intl/server";
import { getActiveAnnouncement } from "@/lib/announcements";
import type { Locale } from "@/i18n/routing";
import type { ResolvedSchedule } from "@/lib/opening-hours";
import { Header } from "@/components/layout/Header";

type SiteHeaderProps = { schedule: ResolvedSchedule };

export async function SiteHeader({ schedule }: SiteHeaderProps) {
  const locale = (await getLocale()) as Locale;
  const announcement = getActiveAnnouncement(locale);

  return <Header announcement={announcement} schedule={schedule} />;
}
