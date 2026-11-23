import { defineField, defineType } from "sanity";

// Mirrors src/content/reviews.ts's reviewPlatforms (Google/DocFinder/Herold)
// exactly — 1 document per platform. Ratings/counts are real, sensitive
// third-party data; edits here must reflect the actual current rating on
// that platform, never an invented number (same caution as legalDocument).
export const reviewPlatform = defineType({
  name: "reviewPlatform",
  title: "Bewertungsplattform",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Plattform-Name (z. B. Google, DocFinder, Herold)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Aktuelle Bewertung (z. B. 4.2)", type: "number", validation: (r) => r.required().min(0).max(5) }),
    defineField({ name: "maxRating", title: "Maximale Bewertung (meist 5)", type: "number", initialValue: 5 }),
    defineField({ name: "reviewCount", title: "Anzahl Bewertungen", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "url", title: "Link zur Bewertungsseite", type: "url", validation: (r) => r.required() }),
    defineField({ name: "writeReviewUrl", title: "Link zum Bewertung-Schreiben (optional, falls abweichend)", type: "url" }),
  ],
  preview: {
    select: { name: "name", rating: "rating", count: "reviewCount" },
    prepare({ name, rating, count }) {
      return { title: name, subtitle: `${rating} ★ (${count} Bewertungen)` };
    },
  },
});
