import { getLocale } from "next-intl/server";
import { GoogleMapEmbed, MapDirectionsPanel } from "@/components/maps/GoogleMapEmbed";
import { HoursCard } from "@/components/shared/HoursCard";

export async function LocationSection() {
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            {lang === "tr" ? "Konum" : "Standort"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-petrol">
            {lang === "tr" ? "Bizi ziyaret edin" : "Besuchen Sie uns"}
          </h2>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <GoogleMapEmbed className="aspect-[16/10] lg:aspect-auto lg:min-h-[420px]" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <MapDirectionsPanel lang={lang} />
            <HoursCard />
          </div>
        </div>
      </div>
    </section>
  );
}
