import { defineField, defineType } from "sanity";

// Urlaub/Schließzeiten — no equivalent in the fahrschule-academy-wien reference,
// designed fresh. Auto-expiry is resolved at build-time query time (filter
// endDate >= today), since there's no server runtime under output: "export"
// to run a live cron — see plan Section 4.1, closurePeriod.
export const closurePeriod = defineType({
  name: "closurePeriod",
  title: "Urlaub / Schließzeit",
  type: "document",
  fields: [
    defineField({ name: "startDate", title: "Von", type: "date", validation: (r) => r.required() }),
    defineField({ name: "endDate", title: "Bis", type: "date", validation: (r) => r.required().min(r.valueOfField("startDate")) }),
    defineField({ name: "reason", title: "Grund (z. B. Sommerurlaub)", type: "localeString" }),
    defineField({
      name: "substituteDoctor",
      title: "Vertretungsarzt",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "phone", title: "Telefon", type: "string" }),
        defineField({ name: "address", title: "Adresse", type: "string" }),
      ],
    }),
    defineField({ name: "active", title: "Aktiv", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { startDate: "startDate", endDate: "endDate", reason: "reason.de" },
    prepare({ startDate, endDate, reason }) {
      return { title: reason || "Urlaub/Schließzeit", subtitle: `${startDate} – ${endDate}` };
    },
  },
});
