import { defineField, defineType } from "sanity";

const WEEKDAYS = [
  { title: "Montag", value: "mon" },
  { title: "Dienstag", value: "tue" },
  { title: "Mittwoch", value: "wed" },
  { title: "Donnerstag", value: "thu" },
  { title: "Freitag", value: "fri" },
  { title: "Samstag", value: "sat" },
  { title: "Sonntag", value: "sun" },
];

// Singleton (see sanity/structure.ts). Models src/lib/opening-hours.ts's real
// clinicSchedule shape — an array of time windows per weekday, so Monday and
// Wednesday's lunch-break split shifts (confirmed in the Phase 2 audit, fixed
// in Phase 3's JSON-LD correction) are representable directly, unlike the
// fahrschule-academy-wien reference project's flat free-text field.
export const openingHours = defineType({
  name: "openingHours",
  title: "Öffnungszeiten",
  type: "document",
  fields: [
    defineField({
      name: "weekdays",
      title: "Wochentage",
      type: "array",
      of: [
        defineField({
          name: "weekday",
          type: "object",
          fields: [
            defineField({ name: "day", title: "Tag", type: "string", options: { list: WEEKDAYS }, validation: (r) => r.required() }),
            defineField({
              name: "windows",
              title: "Zeitfenster (leer = geschlossen)",
              type: "array",
              of: [{ type: "timeWindow" }],
            }),
          ],
          preview: {
            select: { day: "day", windows: "windows" },
            prepare({ day, windows }) {
              const label = WEEKDAYS.find((w) => w.value === day)?.title ?? day;
              const count = Array.isArray(windows) ? windows.length : 0;
              return { title: label, subtitle: count === 0 ? "Geschlossen" : `${count} Zeitfenster` };
            },
          },
        }),
      ],
      validation: (r) => r.required().length(7),
    }),
    defineField({
      name: "specialDays",
      title: "Sonderöffnungszeiten / geschlossene Tage",
      type: "array",
      of: [
        defineField({
          name: "specialDay",
          type: "object",
          fields: [
            defineField({ name: "date", title: "Datum", type: "date", validation: (r) => r.required() }),
            defineField({
              name: "windows",
              title: "Zeitfenster (leer = geschlossen)",
              type: "array",
              of: [{ type: "timeWindow" }],
            }),
            defineField({ name: "note", title: "Hinweis", type: "localeString" }),
          ],
          preview: {
            select: { date: "date", windows: "windows" },
            prepare({ date, windows }) {
              const count = Array.isArray(windows) ? windows.length : 0;
              return { title: date, subtitle: count === 0 ? "Geschlossen" : `${count} Zeitfenster` };
            },
          },
        }),
      ],
    }),
  ],
});
