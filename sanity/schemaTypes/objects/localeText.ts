import { defineField, defineType } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Lokalisierter Fließtext",
  type: "object",
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "text", validation: (r) => r.required() }),
    defineField({ name: "tr", title: "Türkçe", type: "text" }),
  ],
});
