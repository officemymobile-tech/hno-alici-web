import { images } from "@/content/site-content";
import { reviewPlatforms } from "@/content/reviews";
import { siteConfig } from "./site";

export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: "Dr. Ümit Alici",
    image: `${siteConfig.domain}${images.drAliciPortrait}`,
    jobTitle: "Facharzt für Hals-, Nasen- und Ohrenheilkunde",
    medicalSpecialty: ["Otolaryngology", "Pediatric Otolaryngology", "Allergy"],
    url: siteConfig.domain,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    availableLanguage: ["de", "tr"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewPlatforms.google.rating,
      reviewCount: reviewPlatforms.google.reviewCount,
      bestRating: 5,
    },
    sameAs: [
      "https://de-de.facebook.com/HNO.ALICI/",
      reviewPlatforms.google.url,
      reviewPlatforms.docfinder.url,
      reviewPlatforms.herold.url,
    ],
  };
}

export function medicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "HNO Alici – Dr. Ümit Alici",
    url: siteConfig.domain,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: `${siteConfig.domain}${images.ordinationHero}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: "Wien",
      postalCode: "1100",
      addressCountry: "AT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.1712,
      longitude: 16.3713,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "14:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "14:00" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewPlatforms.google.rating,
      reviewCount: reviewPlatforms.google.reviewCount,
      bestRating: 5,
    },
  };
}
