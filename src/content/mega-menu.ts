import type { IconKey } from "@/components/icons/ServiceIcon";
import type { ServiceSlug } from "@/lib/site";

export type MegaMenuCategory = {
  id: "general" | "children" | "allergy";
  overviewSlug: ServiceSlug;
  sectionId: string;
  iconKey: IconKey;
  services: ServiceSlug[];
};

export const megaMenuCategories: MegaMenuCategory[] = [
  {
    id: "general",
    overviewSlug: "allgemeine-hno",
    sectionId: "allgemeine-hno",
    iconKey: "general-hno",
    services: ["hoertest", "schwindel", "schnarchen", "stimmstoerungen"],
  },
  {
    id: "children",
    overviewSlug: "kinder-hno",
    sectionId: "kinder-hno",
    iconKey: "children",
    services: [],
  },
  {
    id: "allergy",
    overviewSlug: "allergologie",
    sectionId: "allergologie",
    iconKey: "allergy",
    services: [],
  },
];
