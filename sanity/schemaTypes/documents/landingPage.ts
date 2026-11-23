import { defineField, defineType } from "sanity";

// Mirrors src/content/seo-landings.ts's seoLandings object (2 entries:
// turkishHno, kinderHno — each bilingual, covering both of its locale's
// URLs). The `slugKey` identifies WHICH of the 2 existing hardcoded pages
// this document overlays — it is informational/matching only, editing it
// does NOT change the real route (routes/URLs stay fixed in code, per the
// explicit instruction to not alter existing URLs/indexing).
export const landingPage = defineType({
  name: "landingPage",
  title: "SEO-Landingpage",
  type: "document",
  fields: [
    defineField({
      name: "slugKey",
      title: "Seite (nur zur Zuordnung — ändert nicht die echte URL)",
      type: "string",
      options: {
        list: [
          { title: "Türkischer HNO Arzt Wien / Türk KBB Doktoru Wien", value: "turkishHno" },
          { title: "Kinder HNO Wien 1100 / Çocuk KBB Wien 1100", value: "kinderHno" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Titel (Browser-Tab)", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "h1", title: "H1 Überschrift", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "metaDescription", title: "Meta-Beschreibung", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "keywords",
      title: "Keywords (gemeinsam für beide Sprachen)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "hero", title: "Hero-Text", type: "localeText" }),
    defineField({
      name: "benefits",
      title: "Vorteile (Liste)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
  ],
  preview: {
    select: { title: "title.de", slugKey: "slugKey" },
    prepare({ title, slugKey }) {
      return { title, subtitle: slugKey };
    },
  },
});
