import { getLocale } from "next-intl/server";
import { Info, AlertTriangle, AlertCircle } from "lucide-react";
import { getActiveAnnouncement, type AnnouncementVariant } from "@/lib/announcements";
import type { Locale } from "@/i18n/routing";

const variantStyles: Record<
  AnnouncementVariant,
  { bar: string; icon: typeof Info }
> = {
  info: {
    bar: "bg-accent-soft border-petrol/20 text-petrol",
    icon: Info,
  },
  warning: {
    bar: "bg-gold/15 border-gold/40 text-petrol-dark",
    icon: AlertTriangle,
  },
  urgent: {
    bar: "bg-petrol text-white border-petrol-dark",
    icon: AlertCircle,
  },
};

export async function AnnouncementBanner() {
  const locale = (await getLocale()) as Locale;
  const announcement = getActiveAnnouncement(locale);
  if (!announcement) return null;

  const { bar, icon: Icon } = variantStyles[announcement.variant];
  const title = announcement.title[locale]?.trim();
  const text = announcement.text[locale]?.trim();
  const linkUrl = announcement.link.url?.trim();
  const linkLabel = announcement.link.label[locale]?.trim();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`border-b px-4 py-3 ${bar}`}
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 sm:px-6 lg:px-8">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-90" aria-hidden />
        <div className="min-w-0 flex-1 text-sm sm:text-base">
          {title ? (
            <p className="font-semibold leading-snug">{title}</p>
          ) : null}
          {text ? (
            <p className={title ? "mt-1 leading-relaxed opacity-95" : "leading-relaxed"}>
              {text}
            </p>
          ) : null}
          {linkUrl && linkLabel ? (
            <p className="mt-2">
              <a
                href={linkUrl}
                className="font-semibold underline underline-offset-2 hover:opacity-80"
                {...(linkUrl.startsWith("http") ? { rel: "noopener noreferrer" } : {})}
              >
                {linkLabel}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
