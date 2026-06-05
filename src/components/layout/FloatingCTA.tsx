"use client";

import { useLocale } from "next-intl";
import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function FloatingCTA() {
  const locale = useLocale();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-8">
      <a
        href={siteConfig.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-petrol shadow-xl ring-1 ring-cream-dark transition hover:scale-105 hover:shadow-2xl lg:hidden"
        aria-label="Google Maps"
      >
        <MapPin size={24} strokeWidth={1.5} />
      </a>
      <a
        href={`tel:${siteConfig.phone}`}
        className="flex items-center gap-3 rounded-full bg-gold px-5 py-4 text-petrol-dark shadow-2xl shadow-gold/30 transition hover:scale-105 hover:bg-gold-light"
      >
        <Phone size={20} strokeWidth={2} className="fill-current" />
        <span className="text-sm font-bold">
          {locale === "tr" ? "Ara" : "Anrufen"}
        </span>
      </a>
    </div>
  );
}
