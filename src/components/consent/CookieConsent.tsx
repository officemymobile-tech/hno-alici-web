"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CONSENT_STORAGE_KEY, parseConsent, saveConsent, type ConsentState } from "@/lib/consent";

const copy = {
  de: {
    title: "Datenschutz-Einstellungen",
    text: "Wir verwenden technisch notwendige Speicher (z. B. Ihre Cookie-Auswahl). Externe Inhalte wie Google Maps laden wir nur mit Ihrer Einwilligung.",
    acceptAll: "Alle akzeptieren",
    essentialOnly: "Nur notwendige",
    settings: "Einstellungen",
    externalLabel: "Externe Medien (Google Maps)",
    externalDesc: "Ermöglicht die eingebettete Kartenansicht. Daten können an Google LLC (USA) übermittelt werden.",
    save: "Auswahl speichern",
    privacy: "Datenschutz",
    cookies: "Cookie-Richtlinie",
  },
  tr: {
    title: "Gizlilik ayarları",
    text: "Teknik olarak gerekli depolama (ör. çerez tercihiniz) kullanıyoruz. Google Maps gibi harici içerikleri yalnızca onayınızla yüklüyoruz.",
    acceptAll: "Tümünü kabul et",
    essentialOnly: "Yalnızca gerekli",
    settings: "Ayarlar",
    externalLabel: "Harici medya (Google Maps)",
    externalDesc: "Gömülü harita görünümünü etkinleştirir. Veriler Google LLC (ABD) aktarılabilir.",
    save: "Seçimi kaydet",
    privacy: "Gizlilik",
    cookies: "Çerez politikası",
  },
} as const;

export function CookieConsent() {
  const locale = useLocale();
  const lang = (locale === "tr" ? "tr" : "de") as keyof typeof copy;
  const t = copy[lang];
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [externalMedia, setExternalMedia] = useState(false);

  useEffect(() => {
    const existing = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    if (!existing) setVisible(true);
  }, []);

  const apply = (state: ConsentState) => {
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: state }));
    setVisible(false);
    setShowSettings(false);
  };

  const handleEssentialOnly = () => apply(saveConsent(false));
  const handleAcceptAll = () => apply(saveConsent(true));
  const handleSaveSettings = () => apply(saveConsent(externalMedia));

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-cream-dark bg-white p-4 shadow-2xl sm:p-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 id="cookie-consent-title" className="font-display text-xl font-semibold text-petrol">
          {t.title}
        </h2>
        <p id="cookie-consent-desc" className="mt-2 text-sm text-text-muted">
          {t.text}
        </p>

        {showSettings && (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-cream p-4">
            <input
              type="checkbox"
              checked={externalMedia}
              onChange={(e) => setExternalMedia(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-cream-dark text-petrol"
            />
            <span>
              <span className="block text-sm font-semibold text-petrol">{t.externalLabel}</span>
              <span className="mt-1 block text-xs text-text-muted">{t.externalDesc}</span>
            </span>
          </label>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-petrol-dark transition hover:bg-gold-light"
          >
            {t.acceptAll}
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="rounded-full border-2 border-petrol px-5 py-2.5 text-sm font-semibold text-petrol transition hover:bg-accent-soft"
          >
            {t.essentialOnly}
          </button>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="text-sm font-medium text-text-muted underline hover:text-petrol"
          >
            {t.settings}
          </button>
          {showSettings && (
            <button
              type="button"
              onClick={handleSaveSettings}
              className="rounded-full bg-petrol px-5 py-2.5 text-sm font-semibold text-white hover:bg-petrol-light"
            >
              {t.save}
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-text-muted">
          <Link href={`/${locale}/datenschutz`} className="underline hover:text-petrol">
            {t.privacy}
          </Link>
          {" · "}
          <Link href={`/${locale}/cookie-richtlinie`} className="underline hover:text-petrol">
            {t.cookies}
          </Link>
        </p>
      </div>
    </div>
  );
}
