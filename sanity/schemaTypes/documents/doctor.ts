import { defineField, defineType } from "sanity";

// Mirrors src/content/doctor-profile.ts's doctorProfile shape exactly, so the
// Phase 4.1a migration script can map 1:1 without reshaping any content.
export const doctor = defineType({
  name: "doctor",
  title: "Arzt",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "isPrimary", title: "Hauptarzt / Ordinationsinhaber", type: "boolean", initialValue: true }),
    defineField({ name: "portrait", title: "Portraitfoto", type: "image", options: { hotspot: true } }),
    defineField({ name: "tagline", title: "Kurzbeschreibung (langer Marketingsatz, z. B. im Hero)", type: "localeString" }),
    defineField({
      name: "clinicalTitle",
      title: "Fachärztliche Berufsbezeichnung (kurz)",
      description: "Z. B. \"Facharzt für Hals-, Nasen- und Ohrenheilkunde\" — erscheint unter dem Namen auf der Startseite (\"Unser Team\"-Bereich) und, für den Hauptarzt, als jobTitle in den strukturierten Daten (Google-Suchergebnisse).",
      type: "localeString",
    }),
    defineField({
      name: "medicalSpecialties",
      title: "Fachgebiete (für Google-Suchergebnisse)",
      description: "Technische Fachgebiets-Codes für strukturierte Daten — keine freie Texteingabe, da Google feste Begriffe erwartet.",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Hals-Nasen-Ohrenheilkunde (Otolaryngology)", value: "Otolaryngology" },
              { title: "Kinder-HNO (Pediatric Otolaryngology)", value: "Pediatric Otolaryngology" },
              { title: "Allergologie (Allergy)", value: "Allergy" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "cv",
      title: "Lebenslauf (Liste)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "qualifications",
      title: "Qualifikationen (Liste)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({ name: "philosophy", title: "Philosophie", type: "localeText" }),
    defineField({
      name: "usps",
      title: "Kernaussagen (kurz)",
      type: "object",
      fields: [
        defineField({ name: "de", title: "Deutsch", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "tr", title: "Türkçe", type: "array", of: [{ type: "string" }] }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "portrait" },
  },
});
