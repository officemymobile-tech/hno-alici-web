import { defineField, defineType } from "sanity";

// Singleton (see sanity/structure.ts). The CMS-side mirror of src/lib/site.ts's
// siteConfig. Deliberately does NOT bolt contact info onto openingHours the
// way the fahrschule-academy-wien reference project does — that pattern was
// explicitly flagged as not to be copied (plan Section 4.1).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website-Einstellungen",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Ordinationsname", type: "string", validation: (r) => r.required() }),
    defineField({ name: "domain", title: "Domain", type: "url" }),
    defineField({ name: "phone", title: "Telefon (für tel:-Links, nur Ziffern/+)", type: "string" }),
    defineField({ name: "phoneDisplay", title: "Telefon (Anzeige)", type: "string" }),
    defineField({ name: "email", title: "E-Mail", type: "string" }),
    defineField({ name: "privacyEmail", title: "Datenschutz-E-Mail", type: "string" }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "object",
      fields: [
        defineField({ name: "street", title: "Straße", type: "string" }),
        defineField({ name: "city", title: "Stadt", type: "string" }),
        defineField({ name: "zip", title: "PLZ", type: "string" }),
        defineField({ name: "country", title: "Land (ISO-Code, z. B. AT)", type: "string" }),
      ],
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Plattform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "mapsUrl", title: "Google Maps URL", type: "url" }),
    defineField({ name: "directionsUrl", title: "Routenplaner URL", type: "url" }),
    defineField({ name: "googleReviewsUrl", title: "Google Bewertungen URL", type: "url" }),
    defineField({
      name: "editableImages",
      title: "Editierbare Bilder (ersetzt das alte Admin-Panel-Bilder-Set)",
      description: "Entspricht 1:1 den Schlüsseln aus editableImageKeys in src/lib/editable-content.ts.",
      type: "object",
      fields: [
        defineField({ name: "ordinationHero", title: "Startseite — Hintergrundfoto", type: "image", options: { hotspot: true } }),
        defineField({ name: "drAliciPortrait", title: "Porträt Dr. Ümit Alici", type: "image", options: { hotspot: true } }),
        defineField({ name: "drMeierPortrait", title: "Porträt Dr. Sigrid Meier", type: "image", options: { hotspot: true } }),
        defineField({ name: "teamFrAlici", title: "Team-Foto Ordination", type: "image", options: { hotspot: true } }),
        defineField({ name: "leistungenOverview", title: "Leistungen — Übersichtsbild", type: "image", options: { hotspot: true } }),
        defineField({
          name: "homeServiceCardAllgemeineHno",
          title: "Startseite — Vorschaukarte: Allgemeine HNO",
          description: "Unabhängig von allen anderen Bildern — ein Wechsel hier ändert kein anderes Foto auf der Website.",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "homeServiceCardKinderHno",
          title: "Startseite — Vorschaukarte: Kinder-HNO",
          description: "Unabhängig von allen anderen Bildern — ein Wechsel hier ändert kein anderes Foto auf der Website.",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "homeServiceCardHoertest",
          title: "Startseite — Vorschaukarte: Hörtest",
          description: "Unabhängig von allen anderen Bildern — ein Wechsel hier ändert kein anderes Foto auf der Website.",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "homeServiceCardAllergologie",
          title: "Startseite — Vorschaukarte: Allergologie",
          description: "Unabhängig von allen anderen Bildern — ein Wechsel hier ändert kein anderes Foto auf der Website.",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "leistungenPageAllgemeineHno",
          title: "Leistungen-Seite — Bild: Allgemeine HNO Untersuchungen",
          description: "Unabhängig von allen anderen Bildern (auch von der gleichnamigen Startseite-Vorschaukarte).",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "leistungenPageKinderHno",
          title: "Leistungen-Seite — Bild: Kinder HNO",
          description: "Unabhängig von allen anderen Bildern (auch von der gleichnamigen Startseite-Vorschaukarte).",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "leistungenPageAllergologie",
          title: "Leistungen-Seite — Bild: Allergieabklärung",
          description: "Unabhängig von allen anderen Bildern (auch von der gleichnamigen Startseite-Vorschaukarte).",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "textOverrides",
      title: "Textüberschreibungen (Hero/About/Hours)",
      description: "Entspricht 1:1 der texts.*.* Struktur aus src/content/site-editable.json.",
      type: "array",
      of: [
        defineField({
          name: "textOverride",
          type: "object",
          fields: [
            defineField({ name: "section", title: "Sektion (z. B. hero, about, hours)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "key", title: "Schlüssel (z. B. title, eyebrow)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Wert", type: "localeString" }),
          ],
          preview: {
            select: { section: "section", key: "key", de: "value.de" },
            prepare({ section, key, de }) {
              return { title: `${section}.${key}`, subtitle: de };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "Globale SEO-Einstellungen",
      type: "object",
      fields: [
        defineField({ name: "defaultMetaDescription", title: "Standard Meta-Beschreibung", type: "localeText" }),
        defineField({ name: "defaultOgImage", title: "Standard OG-Bild", type: "image" }),
      ],
    }),
    defineField({
      name: "pageSeo",
      title: "Seiten-SEO (für Seiten ohne eigenes Schema, z. B. Team, Kontakt)",
      description: "Überschreibt Titel/Beschreibung einzelner Seiten, die keinen eigenen Dokumenttyp haben (z. B. Leistungen-Übersicht, Team, Kontakt, Patienteninfo, Bewertungen, Termin, Rechtsseiten, Arztprofil). Leer lassen, um die Standardwerte aus dem Code zu verwenden.",
      type: "array",
      of: [
        defineField({
          name: "pageSeoEntry",
          type: "object",
          fields: [
            defineField({
              name: "pageKey",
              title: "Seite",
              type: "string",
              options: {
                list: [
                  { title: "Team", value: "team" },
                  { title: "Kontakt", value: "kontakt" },
                  { title: "Leistungen-Übersicht", value: "leistungen" },
                  { title: "Patienteninfo", value: "patienteninfo" },
                  { title: "Bewertungen", value: "bewertungen" },
                  { title: "Termin", value: "termin" },
                  { title: "Arztprofil", value: "dr-uemit-alici" },
                  { title: "Lebenslauf", value: "lebenslauf" },
                  { title: "Qualifikationen", value: "qualifikationen" },
                  { title: "Philosophie", value: "philosophie" },
                  { title: "Impressum", value: "impressum" },
                  { title: "Datenschutz", value: "datenschutz" },
                  { title: "Cookie-Richtlinie", value: "cookie-richtlinie" },
                  { title: "Haftungsausschluss", value: "haftungsausschluss" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "metaTitle", title: "Meta-Titel", type: "localeString" }),
            defineField({ name: "metaDescription", title: "Meta-Beschreibung", type: "localeText" }),
          ],
          preview: { select: { title: "pageKey" } },
        }),
      ],
    }),
    defineField({
      name: "generalFaq",
      title: "Allgemeine FAQ (Startseite & Patienteninfo)",
      description: "Allgemeine, nicht leistungsspezifische Fragen (z. B. Überweisung, Akuttermine). Leistungsspezifische Fragen werden direkt bei der jeweiligen Leistung gepflegt, nicht hier.",
      type: "array",
      of: [
        defineField({
          name: "generalFaqItem",
          type: "object",
          fields: [
            defineField({ name: "q", title: "Frage", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "a", title: "Antwort", type: "localeText", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "q.de" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Website-Einstellungen" };
    },
  },
});
