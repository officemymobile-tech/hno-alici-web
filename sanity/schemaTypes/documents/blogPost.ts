import { defineField, defineType } from "sanity";

// Mirrors src/content/seo-landings.ts's blogPosts[] (slug, date, title,
// excerpt, content, keywords). Uses Sanity's native draft system (the
// document's own drafts.* perspective) rather than a custom boolean flag, so
// an unpublished post never reaches a build that queries perspective:
// "published" — see plan Section 4.1/4.3.
export const blogPost = defineType({
  name: "blogPost",
  title: "Blog-Beitrag",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.de" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Datum", type: "date", validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Kurzbeschreibung", type: "localeText" }),
    defineField({ name: "content", title: "Inhalt", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "coverImage", title: "Titelbild", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title.de", date: "date", media: "coverImage" },
    prepare({ title, date, media }) {
      return { title, subtitle: date, media };
    },
  },
});
