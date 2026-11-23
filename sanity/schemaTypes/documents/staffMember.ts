import { defineField, defineType } from "sanity";

// Mirrors src/content/site-editable.json's team.staff[] (name, role) — adds
// an optional photo + order, both additive (current data has neither), so
// migrated staff members render identically until photos/ordering are set.
export const staffMember = defineType({
  name: "staffMember",
  title: "Mitarbeiter",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Funktion", type: "localeString" }),
    defineField({ name: "photo", title: "Foto", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Reihenfolge", type: "number", initialValue: 0 }),
    defineField({ name: "active", title: "Aktiv (auf Team-Seite anzeigen)", type: "boolean", initialValue: true }),
  ],
  orderings: [
    { title: "Reihenfolge", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role.de", media: "photo" },
  },
});
