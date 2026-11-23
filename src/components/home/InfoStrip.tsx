import Link from "next/link";
import { getLocale } from "next-intl/server";
import { Clock, CalendarClock, Phone, MapPin } from "lucide-react";
import { ClinicOpenStatus } from "@/components/shared/ClinicOpenStatus";
import type { ResolvedSchedule } from "@/lib/opening-hours";
import { siteConfig } from "@/lib/site";

type Props = { schedule: ResolvedSchedule };

// Large white rounded "quick facts" card — status, hours, phone, address —
// overlapping the hero's bottom edge, matching the reference design's
// floating info bar. Deliberately not a second source of hours truth: the
// "open/closed" + "today's hours" text comes from the same resolved
// schedule prop every other consumer uses (ClinicOpenStatus "strip"
// variant), and the hours link points at the existing LocationSection table
// rather than repeating the weekly schedule inline.
export async function InfoStrip({ schedule }: Props) {
  const locale = (await getLocale()) as "de" | "tr";
  const isTr = locale === "tr";

  return (
    <section className="relative z-10 -mt-10 px-4 sm:-mt-12 sm:px-6 lg:-mt-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 divide-y divide-cream-dark rounded-3xl bg-white p-7 shadow-2xl shadow-petrol-dark/20 ring-1 ring-black/5 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-y-0 sm:p-9 lg:grid-cols-4 lg:p-10">
        <div className="flex items-start gap-3.5 pt-7 first:pt-0 sm:pt-0 sm:pr-7">
          <Clock className="mt-0.5 h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden />
          <ClinicOpenStatus variant="strip" schedule={schedule} />
        </div>

        <div className="flex items-start gap-3.5 pt-7 sm:pt-0 sm:px-7">
          <CalendarClock className="mt-0.5 h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden />
          <div className="min-w-0">
            <p className="text-base font-semibold text-petrol">
              {isTr ? "Muayene Saatlerimiz" : "Unsere Öffnungszeiten"}
            </p>
            <Link
              href="#standort"
              className="mt-1 inline-block py-1 text-sm text-text-muted underline decoration-cream-dark decoration-2 underline-offset-2 hover:text-petrol"
            >
              {isTr ? "Tüm saatleri görüntüle" : "Alle Zeiten ansehen"}
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3.5 pt-7 sm:pt-0 sm:px-7">
          <Phone className="mt-0.5 h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden />
          <a href={`tel:${siteConfig.phone}`} className="min-w-0 group">
            <p className="text-base font-semibold text-petrol group-hover:text-petrol-light">{siteConfig.phoneDisplay}</p>
            <p className="mt-1 text-sm text-text-muted">
              {isTr ? "Hemen arayın" : "Jetzt anrufen"}
            </p>
          </a>
        </div>

        <div className="flex items-start gap-3.5 pt-7 sm:pt-0 sm:pl-7">
          <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden />
          <a href={siteConfig.directionsUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 group">
            <p className="text-base font-semibold text-petrol group-hover:text-petrol-light">
              {siteConfig.address.street}
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {siteConfig.address.zip} {siteConfig.address.city}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
