import { defineField, defineType } from "sanity";

// Replaces src/content/announcements.json's single-notice model. Keeps the
// same variant enum (confirmed in src/lib/announcements.ts: info|warning|urgent)
// and replaces its single `validUntil` with startDate/endDate so a notice can
// also be scheduled to start in the future, not just expire. Auto-activation/
// -deactivation is resolved at build-time query time (see openingHours.ts's
// note on why — no server runtime under static export).
export const announcement = defineType({
  name: "announcement",
  title: "Aktuelle Mitteilung",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "variant",
      title: "Art",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warnung", value: "warning" },
          { title: "Dringend", value: "urgent" },
        ],
      },
      initialValue: "info",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priority",
      title: "Priorität (höher = wichtiger, falls mehrere aktiv)",
      type: "number",
      initialValue: 0,
    }),
    defineField({ name: "startDate", title: "Beginn (optional)", type: "datetime" }),
    defineField({ name: "endDate", title: "Ende (optional)", type: "datetime" }),
    defineField({
      name: "link",
      title: "Link (optional)",
      type: "object",
      fields: [
        defineField({ name: "url", title: "URL", type: "url" }),
        defineField({ name: "label", title: "Linktext", type: "localeString" }),
      ],
    }),
    defineField({ name: "active", title: "Aktiv", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "title.de", variant: "variant", active: "active" },
    prepare({ title, variant, active }) {
      return { title: title, subtitle: `${variant}${active ? "" : " (inaktiv)"}` };
    },
  },
});
