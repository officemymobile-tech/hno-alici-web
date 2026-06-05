import type { LegalDocument } from "./types";

export const haftungDe: LegalDocument = {
  title: "Haftungsausschluss & Medizinischer Hinweis",
  updated: "Juni 2026",
  sections: [
    {
      title: "Keine Fernbehandlung",
      paragraphs: [
        "Die Inhalte dieser Website dienen der Information über die HNO-Ordination von Dr. Ümit Alici. Sie ersetzen <strong>keine</strong> ärztliche Untersuchung, Diagnose oder Behandlung.",
        "Eine medizinische Beratung oder Behandlung findet ausschließlich in der Ordination oder nach telefonischer Absprache statt – nicht über das Kontaktformular oder E-Mail.",
      ],
    },
    {
      title: "Notfall",
      paragraphs: [
        "Bei lebensbedrohlichen Notfällen wählen Sie <strong>144</strong> (Rettung) oder suchen Sie die nächste Notaufnahme auf. Die Website ist kein Notfalldienst.",
      ],
    },
    {
      title: "Inhalte & Richtigkeit",
      paragraphs: [
        "Wir bemühen uns um aktuelle und korrekte Informationen, übernehmen jedoch keine Gewähr für Vollständigkeit oder Aktualität. Änderungen der Ordinationszeiten und Leistungen vorbehalten.",
      ],
    },
    {
      title: "Externe Links",
      paragraphs: [
        "Für Inhalte externer Websites (Google, Facebook, DocFinder, Herold etc.) übernehmen wir keine Haftung.",
      ],
    },
    {
      title: "Urheberrecht & Bilder",
      paragraphs: [
        "Texte und Gestaltung dieser Website unterliegen dem Urheberrecht. Einige Bilder wurden mit KI-Unterstützung erstellt oder optimiert. Verwendung nur mit Zustimmung.",
      ],
    },
  ],
};
