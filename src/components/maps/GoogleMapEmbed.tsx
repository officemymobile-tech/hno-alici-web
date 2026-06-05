"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { reviewPlatforms } from "@/content/reviews";
import { images } from "@/content/site-content";
import { CONSENT_STORAGE_KEY, parseConsent, saveConsent, type ConsentState } from "@/lib/consent";
import { siteConfig } from "@/lib/site";

type GoogleMapEmbedProps = {
  className?: string;
  height?: string;
  title?: string;
};

export function GoogleMapEmbed({
  className = "",
  height = "100%",
  title = "Google Maps – HNO Alici Wien",
}: GoogleMapEmbedProps) {
  const locale = useLocale();
  const lang = locale as "de" | "tr";
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY)));
    const onUpdate = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("consent-updated", onUpdate);
    return () => window.removeEventListener("consent-updated", onUpdate);
  }, []);

  const enableMaps = () => {
    const state = saveConsent(true);
    setConsent(state);
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: state }));
  };

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    reviewPlatforms.google.mapsEmbedQuery,
  )}&hl=${lang}&z=16&ie=UTF8&iwloc=&output=embed`;

  const showMap = consent?.externalMedia === true;

  const labels = {
    de: {
      placeholder: "Karte wird nur mit Ihrer Einwilligung geladen (Google Maps).",
      load: "Google Maps anzeigen",
      open: "In Google Maps öffnen",
    },
    tr: {
      placeholder: "Harita yalnızca onayınızla yüklenir (Google Maps).",
      load: "Google Maps göster",
      open: "Google Maps'te aç",
    },
  }[lang];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-cream-dark ${className}`}
      style={{ minHeight: height }}
    >
      {showMap ? (
        <iframe
          title={title}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream p-6 text-center">
          <Image
            src={images.googleMap}
            alt=""
            fill
            className="object-cover opacity-30"
            aria-hidden
          />
          <div className="relative z-10 max-w-sm rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-cream-dark backdrop-blur">
            <MapPin className="mx-auto h-8 w-8 text-petrol" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-text-muted">{labels.placeholder}</p>
            <button
              type="button"
              onClick={enableMaps}
              className="mt-4 w-full rounded-full bg-petrol px-4 py-2.5 text-sm font-semibold text-white hover:bg-petrol-light"
            >
              {labels.load}
            </button>
            <a
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-petrol underline hover:text-petrol-light"
            >
              {labels.open}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function MapDirectionsPanel({ lang }: { lang: "de" | "tr" }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-cream-dark">
      <h3 className="font-display text-2xl font-semibold text-petrol">
        {lang === "tr" ? "Ulaşım" : "Anfahrt"}
      </h3>
      <address className="mt-4 space-y-2 not-italic text-text-muted">
        <p className="font-medium text-petrol">
          {siteConfig.address.street}, {siteConfig.address.zip} {siteConfig.address.city}
        </p>
        <p>{lang === "tr" ? "Wien 10. bölge (Favoriten)" : "Wien 10. Bezirk (Favoriten)"}</p>
        <p>{lang === "tr" ? "Toplu taşıma ve otopark mevcut" : "Öffentliche Anbindung & Parkmöglichkeiten in der Nähe"}</p>
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
  );
}
