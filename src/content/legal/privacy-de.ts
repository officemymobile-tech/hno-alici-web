import type { LegalDocument } from "./types";

export const privacyDe: LegalDocument = {
  title: "Datenschutzerklärung",
  updated: "Juni 2026",
  sections: [
    {
      id: "verantwortlicher",
      title: "1. Verantwortlicher",
      paragraphs: [
        "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
        "<strong>Dr. Ümit Alici</strong><br>Facharzt für Hals-, Nasen- und Ohrenheilkunde<br>Senefeldergasse 3/1, 1100 Wien<br>E-Mail: <a href=\"mailto:ordination@hno-alici.at\">ordination@hno-alici.at</a><br>Datenschutz-Kontakt: <a href=\"mailto:datenschutz@hno-alici.at\">datenschutz@hno-alici.at</a>",
      ],
    },
    {
      id: "aufsehen",
      title: "2. Aufsichtsbehörde",
      paragraphs: [
        "Österreichische Datenschutzbehörde (DSB)<br>Barichgasse 40–42, 1030 Wien<br><a href=\"https://www.dsb.gv.at\" rel=\"noopener noreferrer\">www.dsb.gv.at</a>",
      ],
    },
    {
      id: "hosting",
      title: "3. Hosting & Server-Logfiles",
      paragraphs: [
        "Diese Website wird bei <strong>Vercel Inc.</strong> gehostet (Rechenzentrum EU, Region Frankfurt). Beim Aufruf werden technisch bedingt Verbindungsdaten verarbeitet (z. B. IP-Adresse, Zeitpunkt, angeforderte Seite, Browser-Typ). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).",
        "Mit Vercel wurde ein Auftragsverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO abgeschlossen bzw. ist über die Standardverträge des Anbieters abzuschließen. Speicherdauer der Logfiles: gemäß Vercel-Richtlinien, in der Regel kurzfristig.",
      ],
    },
    {
      id: "cookies",
      title: "4. Cookies & lokale Speicher",
      paragraphs: [
        "Wir setzen <strong>keine Analyse- oder Marketing-Cookies</strong> ein. Technisch notwendig ist die Speicherung Ihrer Cookie-Einstellungen (localStorage, Schlüssel: hno-alici-cookie-consent-v1).",
        "Externe Medien (Google Maps) werden nur nach Ihrer Einwilligung geladen. Details: <a href=\"/de/cookie-richtlinie\">Cookie-Richtlinie</a>. Rechtsgrundlage externe Medien: Art. 6 Abs. 1 lit. a DSGVO iVm § 165 TKG 2021.",
      ],
    },
    {
      id: "formular",
      title: "5. Termin- und Kontaktanfragen",
      paragraphs: [
        "Bei Nutzung des Online-Formulars verarbeiten wir: Name, Telefonnummer, optional E-Mail, optional Nachricht, optional Akut-Hinweis. Die Übermittlung erfolgt über Ihren E-Mail-Client (mailto-Link) an ordination@hno-alici.at.",
        "<strong>Wichtig:</strong> Bitte teilen Sie <strong>keine Gesundheitsdaten</strong> (Symptome, Diagnosen, Befunde) im Formular mit. Bei medizinischen Beschwerden kontaktieren Sie uns telefonisch.",
        "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Anbahnung einer Behandlungs-/Terminvereinbarung) und Art. 6 Abs. 1 lit. a DSGVO (Einwilligung in die Kontaktaufnahme). Speicherdauer E-Mails: bis zur Erledigung der Anfrage, längstens 12 Monate, sofern keine ärztliche Dokumentationspflicht entgegensteht.",
      ],
    },
    {
      id: "gesundheitsdaten",
      title: "6. Gesundheitsdaten",
      paragraphs: [
        "Gesundheitsdaten sind besonders schützenswert (Art. 9 DSGVO). Diese Website ist <strong>nicht</strong> für die Übermittlung von Gesundheitsdaten per Formular oder E-Mail vorgesehen.",
        "Eine Verarbeitung von Gesundheitsdaten erfolgt ausschließlich im Rahmen der ärztlichen Behandlung in der Ordination auf gesonderten Rechtsgrundlagen (Art. 9 Abs. 2 lit. h DSGVO, nationales Recht).",
      ],
    },
    {
      id: "externe",
      title: "7. Externe Dienste & Links",
      paragraphs: [
        "<strong>Google Maps:</strong> Nur nach Einwilligung. Anbieter: Google Ireland Limited / Google LLC (USA). Es können Cookies und personenbezogene Daten (z. B. IP) übertragen werden. Datenschutz: <a href=\"https://policies.google.com/privacy\" rel=\"noopener noreferrer\">Google Privacy Policy</a>.",
        "Links zu Google Bewertungen, DocFinder, Herold, Facebook führen zu externen Websites mit eigener Datenverarbeitung.",
        "Schriftarten werden über next/font lokal gehostet – kein Abruf bei Google Fonts CDN.",
      ],
    },
    {
      id: "bilder",
      title: "8. Bilder & KI-Hinweis",
      paragraphs: [
        "Einige Praxisbilder wurden mit KI-Unterstützung auf Basis realer Aufnahmen optimiert. Es werden keine Patientenfotos veröffentlicht. Bewertungszitate sind anonymisiert bzw. stammen von öffentlichen Plattformen.",
      ],
    },
    {
      id: "rechte",
      title: "9. Ihre Rechte",
      paragraphs: [
        "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch und Widerruf erteilter Einwilligungen. Beschwerden können Sie bei der DSB einbringen.",
        "Anfragen an: <a href=\"mailto:datenschutz@hno-alici.at\">datenschutz@hno-alici.at</a>. Weitere Informationen zum Auskunftsprozess: siehe internes Verfahren in der Ordination (Verarbeitungsverzeichnis).",
      ],
    },
  ],
};
