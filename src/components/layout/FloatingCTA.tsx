"use client";

import { useLocale } from "next-intl";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

// Single, compact floating call button — reduced from the previous 2-button
// stack (phone pill + a separate map-pin circle) after a real defect was
// found: on mobile, the stacked pair's footprint was large enough to
// overlap/obscure body text at some scroll positions (e.g. the Reviews
// section's quote card). Maps are already reachable from every page via the
// footer's "Google Maps" link, the homepage's info strip/location section,
// and the Kontakt page — so the map shortcut wasn't the only way to get
// there, and removing it meaningfully shrinks the occlusion risk.
export function FloatingCTA() {
  const locale = useLocale();

  return (
    <a
      href={`tel:${siteConfig.phone}`}
      aria-label={locale === "tr" ? "Hemen ara" : "Jetzt anrufen"}
      className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-petrol-dark shadow-xl shadow-gold/30 transition hover:scale-105 hover:bg-gold-light sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2.5 sm:px-5 sm:py-3.5"
    >
      <Phone size={20} strokeWidth={2} className="fill-current" />
      <span className="hidden text-sm font-bold sm:inline">
        {locale === "tr" ? "Ara" : "Anrufen"}
      </span>
    </a>
  );
}
