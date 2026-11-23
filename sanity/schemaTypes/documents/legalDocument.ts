import { defineField, defineType } from "sanity";

// Mirrors src/content/legal/types.ts's LegalDocument/LegalSection shape, kept
// per-locale rather than collapsed into localeString/localeText objects
// (legal sections are long, structured, and the two languages' section
// counts/order are not guaranteed to match 1:1).
//
// IMPORTANT (plan Section 4.1): this schema may be built and deployed now,
// but the first real migration of actual impressum/privacy/etc. text into
// Sanity documents requires a legal-reviewer sign-off first — it is NOT part
// of the technical plumbing work and must not happen automatically.
export const legalDocument = defineType({
  name: "legalDocument",
  title: "Rechtsdokument",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Seite",
      type: "string",
      options: {
        list: [
          { title: "Impressum", value: "impressum" },
          { title: "Datenschutz", value: "privacy" },
          { title: "Haftungsausschluss", value: "haftung" },
          { title: "Cookie-Richtlinie", value: "cookies" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "locale",
      title: "Sprache",
      type: "string",
      options: { list: [{ title: "Deutsch", value: "de" }, { title: "Türkçe", value: "tr" }] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "updated", title: "Zuletzt aktualisiert", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "sections",
      title: "Abschnitte",
      type: "array",
      of: [
        defineField({
          name: "legalSection",
          type: "object",
          fields: [
            defineField({ name: "sectionId", title: "Anker-ID (optional)", type: "string" }),
            defineField({ name: "title", title: "Überschrift", type: "string" }),
            defineField({ name: "paragraphs", title: "Absätze", type: "array", of: [{ type: "text" }] }),
            defineField({ name: "list", title: "Liste (optional)", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", pageKey: "pageKey", locale: "locale" },
    prepare({ title, pageKey, locale }) {
      return { title, subtitle: `${pageKey} / ${locale}` };
    },
  },
});
