"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { siteConfig } from "@/lib/site";

export function AppointmentForm() {
  const locale = useLocale();
  const lang = locale as "de" | "tr";
  const [submitted, setSubmitted] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const labels = {
    de: {
      priority: "Schnellster Weg: Telefonisch",
      priorityText: "Für akute Beschwerden rufen Sie uns bitte direkt an – wir vergeben kurzfristige Termine.",
      callNow: "Jetzt anrufen",
      or: "oder Anfrage per Formular",
      name: "Name",
      phone: "Telefon",
      email: "E-Mail (optional)",
      message: "Wunschtermin / kurze Nachricht (optional)",
      messageHint: "Bitte keine Symptome, Diagnosen oder Gesundheitsdaten eingeben – dazu rufen Sie uns an.",
      acute: "Akute Beschwerden",
      consent: "Ich willige ein, dass meine Angaben zur Bearbeitung meiner Terminanfrage verarbeitet und ich unter den angegebenen Kontaktdaten erreicht werde. Ich habe die Datenschutzerklärung gelesen.",
      privacy: "Datenschutzerklärung",
      submit: "Anfrage senden",
      thanks: "Vielen Dank! Wir melden uns schnellstmöglich telefonisch bei Ihnen.",
      note: "Wir bevorzugen telefonische Terminvereinbarung für schnellere Bearbeitung.",
      consentRequired: "Bitte bestätigen Sie die Datenschutzeinwilligung.",
      emergency: "Lebensbedrohlicher Notfall? Rufen Sie 144 an.",
    },
    tr: {
      priority: "En hızlı yol: Telefon",
      priorityText: "Acil şikayetlerde lütfen doğrudan arayın – kısa sürede randevu veriyoruz.",
      callNow: "Hemen ara",
      or: "veya form ile talep",
      name: "Ad Soyad",
      phone: "Telefon",
      email: "E-posta (isteğe bağlı)",
      message: "Randevu isteği / kısa mesaj (isteğe bağlı)",
      messageHint: "Lütfen semptom veya sağlık verisi yazmayın – bunun için bizi arayın.",
      acute: "Acil şikayetler",
      consent: "Bilgilerimin randevu talebim için işlenmesine ve belirttiğim iletişim kanalından ulaşılmasına onay veriyorum. Gizlilik politikasını okudum.",
      privacy: "Gizlilik politikası",
      submit: "Talep gönder",
      thanks: "Teşekkürler! En kısa sürede sizi arayacağız.",
      note: "Daha hızlı işlem için telefonla randevuyu tercih ediyoruz.",
      consentRequired: "Lütfen gizlilik onayını işaretleyin.",
      emergency: "Hayati tehlike? 144'ü arayın.",
    },
  }[lang];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!data.get("consent")) {
      setConsentError(true);
      return;
    }
    setConsentError(false);

    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const message = data.get("message");
    const acute = data.get("acute") ? (lang === "tr" ? "Acil" : "Akut") : "";

    const subject = encodeURIComponent(`Terminanfrage HNO Alici – ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nTelefon: ${phone}\nE-Mail: ${email}\n${acute ? `Priorität: ${acute}\n` : ""}\nNachricht:\n${message}\n\n[Einwilligung Datenschutz: ja]`,
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-accent-soft p-8 text-center">
        <p className="text-lg font-medium text-petrol">{labels.thanks}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-petrol p-8 text-center text-white">
        <p className="font-display text-2xl font-semibold">{labels.priority}</p>
        <p className="mt-3 text-white/80">{labels.priorityText}</p>
        <a
          href={`tel:${siteConfig.phone}`}
          data-cta="phone-primary"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-petrol-dark transition hover:bg-gold-light"
        >
          {labels.callNow}: {siteConfig.phoneDisplay}
        </a>
        <p className="mt-4 text-sm text-white/70">{labels.emergency}</p>
      </div>

      <p className="text-center text-sm font-medium uppercase tracking-widest text-text-muted">{labels.or}</p>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-cream-dark">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-petrol">{labels.name} *</span>
            <input name="name" required autoComplete="name" className="mt-1 w-full rounded-xl border border-cream-dark px-4 py-3 focus:border-petrol focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-petrol">{labels.phone} *</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="mt-1 w-full rounded-xl border border-cream-dark px-4 py-3 focus:border-petrol focus:outline-none" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-petrol">{labels.email}</span>
          <input name="email" type="email" autoComplete="email" className="mt-1 w-full rounded-xl border border-cream-dark px-4 py-3 focus:border-petrol focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-petrol">{labels.message}</span>
          <textarea name="message" rows={3} className="mt-1 w-full rounded-xl border border-cream-dark px-4 py-3 focus:border-petrol focus:outline-none" />
          <span className="mt-1 block text-xs text-gold">{labels.messageHint}</span>
        </label>
        <label className="flex items-center gap-3">
          <input name="acute" type="checkbox" className="h-5 w-5 rounded border-cream-dark text-petrol" />
          <span className="text-sm text-text-muted">{labels.acute}</span>
        </label>
        <label className="flex items-start gap-3 rounded-xl bg-cream p-4">
          <input name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 rounded border-cream-dark text-petrol" />
          <span className="text-sm text-text-muted">
            {labels.consent}{" "}
            <Link href={`/${locale}/datenschutz`} className="font-medium text-petrol underline">
              {labels.privacy}
            </Link>
          </span>
        </label>
        {consentError && (
          <p className="text-sm font-medium text-red-700" role="alert">
            {labels.consentRequired}
          </p>
        )}
        <button
          type="submit"
          data-cta="form-submit"
          className="w-full rounded-full bg-petrol py-4 font-semibold text-white transition hover:bg-petrol-light sm:w-auto sm:px-10"
        >
          {labels.submit}
        </button>
        <p className="text-center text-xs text-text-muted">{labels.note}</p>
      </form>
    </div>
  );
}
