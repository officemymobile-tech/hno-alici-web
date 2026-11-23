import { defineField, defineType } from "sanity";

// Mirrors src/content/seo-services.ts's SeoServiceContent exactly. `slug` is
// a fixed-list select, not a free-text slug field — serviceSlugs stays a TS
// const in src/lib/site.ts for static-export route-generation safety (plan
// Section 4.1), so this schema only lets editors pick among the slugs that
// already have a generateStaticParams route, never invent a new route.
export const service = defineType({
  name: "service",
  title: "Medizinische Leistung",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      description: "Muss einem bestehenden Routen-Slug in src/lib/site.ts (serviceSlugs) entsprechen.",
      options: {
        list: [
          "allgemeine-hno",
          "kinder-hno",
          "allergologie",
          "hoertest",
          "schwindel",
          "schnarchen",
          "stimmstoerungen",
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "h1", title: "H1 Überschrift (Detailseite, mit Ort)", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "shortTitle",
      title: "Kurzname (für Menü & Startseite, ohne Ort)",
      description: "Z. B. \"Allgemeine HNO\" statt der vollen H1 \"Allgemeine HNO Wien 1100\" — erscheint im Leistungen-Menü und auf der Startseite-Kachel.",
      type: "localeString",
    }),
    defineField({
      name: "cardText",
      title: "Kurztext für Startseite & Menü",
      description:
        "Kurzer Anreißertext (1 Satz), der auf der Startseite-Kachel und im Leistungen-Menü erscheint — bewusst kürzer als die Einleitung auf der Detailseite. Leer lassen, um die Standardwerte zu verwenden.",
      type: "localeString",
    }),
    defineField({ name: "metaTitle", title: "Meta-Titel", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "metaDescription", title: "Meta-Beschreibung", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({ name: "intro", title: "Einleitung", type: "localeText" }),
    defineField({
      name: "symptoms",
      title: "Symptome (Liste)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "treatments",
      title: "Behandlungen (Liste)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        defineField({
          name: "faqItem",
          type: "object",
          fields: [
            defineField({ name: "q", title: "Frage", type: "localeString" }),
            defineField({ name: "a", title: "Antwort", type: "localeText" }),
          ],
          preview: { select: { title: "q.de" } },
        }),
      ],
    }),
    defineField({ name: "image", title: "Bild", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "h1.de", subtitle: "slug" },
  },
});
