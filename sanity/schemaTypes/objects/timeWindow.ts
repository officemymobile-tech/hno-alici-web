import { defineField, defineType } from "sanity";

// One open/close window. openingHours.weekdays[].windows and
// openingHours.specialDays[].windows both use this — Monday/Wednesday need
// two of these per day (the lunch-break split shift confirmed in the Phase 2
// audit as src/lib/opening-hours.ts's clinicSchedule).
export const timeWindow = defineType({
  name: "timeWindow",
  title: "Zeitfenster",
  type: "object",
  fields: [
    defineField({
      name: "opens",
      title: "Von",
      type: "string",
      description: "HH:mm, z. B. 09:00",
      validation: (r) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:mm" }),
    }),
    defineField({
      name: "closes",
      title: "Bis",
      type: "string",
      description: "HH:mm, z. B. 13:00",
      validation: (r) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:mm" }),
    }),
  ],
  preview: {
    select: { opens: "opens", closes: "closes" },
    prepare({ opens, closes }) {
      return { title: `${opens} – ${closes}` };
    },
  },
});
