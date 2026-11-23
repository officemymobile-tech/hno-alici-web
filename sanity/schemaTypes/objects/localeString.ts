import { defineField, defineType } from "sanity";

// Manual-i18n pair matching every {de, tr} string pair already used throughout
// hno-alici-web's src/content/*.ts and messages/{de,tr}.json — not Sanity's
// native document-level i18n, so migrated content and components keep the
// same {de, tr} shape they already have.
export const localeString = defineType({
  name: "localeString",
  title: "Lokalisierter Text",
  type: "object",
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tr", title: "Türkçe", type: "string" }),
  ],
});
