import { defineField, defineType } from "sanity";

// Mirrors src/content/reviews.ts's patientReviews[] (ReviewItem) exactly.
// Real patient testimonials — edits/migrations must preserve exact wording
// and attribution, never paraphrase or invent a review (same caution as
// legalDocument/reviewPlatform).
export const patientReview = defineType({
  name: "patientReview",
  title: "Patientenbewertung",
  type: "document",
  fields: [
    defineField({ name: "rating", title: "Sterne (1–5)", type: "number", validation: (r) => r.required().min(1).max(5) }),
    defineField({ name: "title", title: "Überschrift", type: "localeString" }),
    defineField({ name: "text", title: "Bewertungstext", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "author", title: "Autor (wie auf der Plattform angezeigt)", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "source",
      title: "Quelle",
      type: "string",
      options: {
        list: [
          { title: "Google", value: "google" },
          { title: "DocFinder", value: "docfinder" },
          { title: "Herold", value: "herold" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "originalLocale",
      title: "Ursprache der Bewertung (optional, falls nicht Deutsch)",
      description: "Z. B. \"en\", wenn die Bewertung ursprünglich auf Englisch verfasst wurde.",
      type: "string",
    }),
    defineField({ name: "order", title: "Reihenfolge", type: "number", initialValue: 0 }),
    defineField({ name: "active", title: "Aktiv (anzeigen)", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Reihenfolge", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.de", author: "author", source: "source" },
    prepare({ title, author, source }) {
      return { title: title || author, subtitle: `${author} · ${source}` };
    },
  },
});
