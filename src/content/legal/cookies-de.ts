import type { LegalDocument } from "./types";

export const cookiesDe: LegalDocument = {
  title: "Cookie-Richtlinie",
  updated: "Juni 2026",
  sections: [
    {
      title: "Was sind Cookies?",
      paragraphs: [
        "Cookies sind kleine Textdateien, die im Browser gespeichert werden können. Wir verwenden zusätzlich localStorage für Ihre Einwilligungsauswahl.",
      ],
    },
    {
      title: "Übersicht",
      list: [
        "<strong>Notwendig (localStorage):</strong> Speicherung Ihrer Datenschutz-Einstellungen – ohne Einwilligung erforderlich.",
        "<strong>Externe Medien (Google Maps):</strong> Nur nach Opt-in. Anbieter Google. Zweck: Kartenanzeige. Speicherdauer: session / gemäß Google.",
        "<strong>Analytics:</strong> Nicht eingesetzt.",
        "<strong>Marketing:</strong> Nicht eingesetzt.",
      ],
      paragraphs: [],
    },
    {
      title: "Einwilligung widerrufen",
      paragraphs: [
        "Sie können Ihre Auswahl jederzeit ändern, indem Sie die Website-Daten im Browser löschen oder uns unter datenschutz@hno-alici.at kontaktieren.",
        "Weitere Informationen: <a href=\"/de/datenschutz\">Datenschutzerklärung</a>.",
      ],
    },
  ],
};
