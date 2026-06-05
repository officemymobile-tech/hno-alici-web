export const siteConfig = {
  name: "Dr. Ümit Alici",
  domain: "https://hno-alici.at",
  phone: "+4316025400",
  phoneDisplay: "+43 1 6025400",
  email: "ordination@hno-alici.at",
  address: {
    street: "Senefeldergasse 3/1",
    city: "Wien",
    zip: "1100",
    country: "AT",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Senefeldergasse+3/1,+1100+Wien,+Austria",
  googleReviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
  privacyEmail: "datenschutz@hno-alici.at",
} as const;

export const serviceSlugs = [
  "allgemeine-hno",
  "kinder-hno",
  "allergologie",
  "hoertest",
  "schwindel",
  "schnarchen",
  "stimmstoerungen",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceSlugToKey: Record<
  ServiceSlug,
  keyof typeof import("../../messages/de.json")["services"]
> = {
  "allgemeine-hno": "general",
  "kinder-hno": "children",
  allergologie: "allergy",
  hoertest: "hearing",
  schwindel: "vertigo",
  schnarchen: "snoring",
  stimmstoerungen: "voice",
};
