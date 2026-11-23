import { images } from "@/content/site-content";
import { reviewPlatforms } from "@/content/reviews";
import { doctorProfile } from "@/content/doctor-profile";
import { getEditableImage } from "./editable-content";
import { siteConfig } from "./site";
import { resolvedSchedule } from "./opening-hours-source";

const SCHEMA_DAY_NAME: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Derives JSON-LD OpeningHoursSpecification entries from the same
 * resolvedSchedule the live ticker and HoursCard use — previously a
 * separately hardcoded array here that drifted from the real schedule
 * (confirmed and fixed once already in Phase 3; this closes the gap
 * permanently so it can't drift again). Schema.org's openingHoursSpecification
 * only models the regular weekly schedule, not date-specific special
 * days/closures, so those aren't represented here — consistent with how
 * every other site using this vocabulary handles holidays/vacation. */
function openingHoursFromSchedule() {
  const entries: Array<{ "@type": "OpeningHoursSpecification"; dayOfWeek: string; opens: string; closes: string }> = [];
  for (const [dayNum, slots] of Object.entries(resolvedSchedule.weekdays)) {
    const dayName = SCHEMA_DAY_NAME[Number(dayNum)];
    if (!dayName) continue;
    for (const slot of slots) {
      entries.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayName,
        opens: formatTime(slot.startHour, slot.startMinute),
        closes: formatTime(slot.endHour, slot.endMinute),
      });
    }
  }
  return entries;
}

export function physicianSchema() {
  const portrait = getEditableImage("drAliciPortrait", doctorProfile.portrait);
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctorProfile.name,
    image: `${siteConfig.domain}${portrait}`,
    jobTitle: doctorProfile.clinicalTitle?.de || "Facharzt für Hals-, Nasen- und Ohrenheilkunde",
    medicalSpecialty: doctorProfile.medicalSpecialties ?? ["Otolaryngology", "Pediatric Otolaryngology", "Allergy"],
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
  const heroImage = getEditableImage("ordinationHero", images.ordinationHero);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: `HNO Alici – ${doctorProfile.name}`,
    url: siteConfig.domain,
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: `${siteConfig.domain}${heroImage}`,
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
    openingHoursSpecification: openingHoursFromSchedule(),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewPlatforms.google.rating,
      reviewCount: reviewPlatforms.google.reviewCount,
      bestRating: 5,
    },
  };
}
