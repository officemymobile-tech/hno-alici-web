import { getLocale, getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { GoogleMapEmbed } from "@/components/maps/GoogleMapEmbed";
import { ClinicOpenStatus } from "@/components/shared/ClinicOpenStatus";
import { getEditableText } from "@/lib/editable-content";
import { resolvedSchedule } from "@/lib/opening-hours-source";
import { siteConfig } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const days = [
  ["monday", "mondayHours"],
  ["tuesday", "tuesdayHours"],
  ["wednesday", "wednesdayHours"],
  ["thursday", "thursdayHours"],
  ["friday", "fridayHours"],
] as const;

// Homepage-only cohesive "Standort" panel: map + address/directions + hours
// as one premium card (not three stacked separate cards) — built inline
// rather than reusing MapDirectionsPanel/HoursCard, since those two stay
// exactly as they are for /kontakt's own (intentionally different) layout.
export async function LocationSection() {
  const locale = (await getLocale()) as Locale;
  const lang = locale as "de" | "tr";
  const t = await getTranslations("hours");

  return (
    <section id="standort" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-ink">
            {lang === "tr" ? "Konum" : "Standort"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-petrol sm:text-5xl">
            {lang === "tr" ? "Bizi ziyaret edin" : "Besuchen Sie uns"}
          </h2>
        </div>

        <div className="mt-14 grid min-w-0 gap-8 lg:grid-cols-5">
          <div className="min-w-0 lg:col-span-3">
            <GoogleMapEmbed className="aspect-[16/10] lg:aspect-auto lg:min-h-[560px]" />
          </div>

          <div className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-cream-dark lg:col-span-2">
            <div className="p-8">
              <h3 className="font-display text-2xl font-semibold text-petrol">
                {lang === "tr" ? "Ulaşım" : "Anfahrt"}
              </h3>
              <address className="mt-4 space-y-2 not-italic text-text-muted">
                <p className="font-medium text-petrol">
                  {siteConfig.address.street}, {siteConfig.address.zip} {siteConfig.address.city}
                </p>
                <p>{lang === "tr" ? "Wien 10. bölge (Favoriten)" : "Wien 10. Bezirk (Favoriten)"}</p>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-petrol px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-petrol-light"
                >
                  <MapPin size={16} strokeWidth={1.5} />
                  Google Maps
                </a>
                <a
                  href={siteConfig.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-petrol px-5 py-2.5 text-sm font-semibold text-petrol transition hover:bg-accent-soft"
                >
                  {lang === "tr" ? "Yol tarifi" : "Route planen"}
                </a>
              </div>
            </div>

            <div className="border-t border-cream-dark p-8">
              <ClinicOpenStatus variant="card" schedule={resolvedSchedule} className="mb-6" />
              <h3 className="font-display text-xl font-semibold text-petrol">
                {getEditableText("hours", "title", locale, t("title"))}
              </h3>
              <dl className="mt-5 space-y-3">
                {days.map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-4 border-b border-cream-dark pb-3 text-sm last:border-0">
                    <dt className="font-medium text-text">{t(day)}</dt>
                    <dd className="text-right text-text-muted">
                      {getEditableText("hours", hours, locale, t(hours))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
