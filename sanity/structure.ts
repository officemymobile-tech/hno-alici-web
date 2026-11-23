import type { StructureResolver } from "sanity/structure";

// Pins openingHours and siteSettings as singletons (plan Section 4.1/4.2,
// same technique as the fahrschule-academy-wien reference's
// document.singletons) and groups everything else by document type.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhalte")
    .items([
      S.listItem()
        .title("Öffnungszeiten")
        .id("openingHours")
        .child(S.document().schemaType("openingHours").documentId("openingHours")),
      S.listItem()
        .title("Website-Einstellungen")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("doctor").title("Ärzte"),
      S.documentTypeListItem("staffMember").title("Mitarbeiter"),
      S.documentTypeListItem("closurePeriod").title("Urlaub / Schließzeiten"),
      S.documentTypeListItem("announcement").title("Aktuelle Mitteilungen"),
      S.documentTypeListItem("service").title("Medizinische Leistungen"),
      S.documentTypeListItem("landingPage").title("SEO-Landingpages"),
      S.documentTypeListItem("blogPost").title("Blog"),
      S.documentTypeListItem("reviewPlatform").title("Bewertungsplattformen"),
      S.documentTypeListItem("patientReview").title("Patientenbewertungen"),
      S.documentTypeListItem("legalDocument").title("Rechtsdokumente"),
    ]);

export const singletonTypes = new Set(["openingHours", "siteSettings"]);
