import { images } from "./site-content";
import { isSanityContentEnabled, sanityReadFailed } from "@/lib/content-source";
import { fetchDoctorProfile } from "@/lib/sanity/queries";

type DoctorProfileShape = {
  name: string;
  portrait: string;
  portraitPosition?: string;
  tagline: { de: string; tr: string };
  clinicalTitle?: { de: string; tr: string };
  medicalSpecialties?: string[];
  cv: { de: string[]; tr: string[] };
  qualifications: { de: string[]; tr: string[] };
  philosophy: { de: string; tr: string };
  usps: { de: string[]; tr: string[] };
};

const localDoctorProfile: DoctorProfileShape = {
  name: "Dr. Ümit Alici",
  portrait: images.drAliciPortrait,
  tagline: {
    de: "Ihr türkisch- und deutschsprachiger HNO-Facharzt in Wien Favoriten",
    tr: "Wien Favoriten'de Türkçe ve Almanca KBB uzmanınız",
  },
  clinicalTitle: {
    de: "Facharzt für Hals-, Nasen- und Ohrenheilkunde",
    tr: "Kulak Burun Boğaz Uzmanı",
  },
  medicalSpecialties: ["Otolaryngology", "Pediatric Otolaryngology", "Allergy"],
  cv: {
    de: [
      "Facharzt für Hals-, Nasen- und Ohrenheilkunde (Österreich)",
      "Schwerpunkt: Allgemeine HNO und Kinder-HNO",
      "Ordination in Wien 1100 – Favoriten",
      "Mitglied der Wiener Ärztekammer",
      "Tätigkeit in deutsch- und türkischsprachiger Patientenbetreuung",
      "Allergologische Diagnostik und Therapie",
    ],
    tr: [
      "Kulak Burun Boğaz uzmanı (Avusturya)",
      "Odak: Genel KBB ve Çocuk KBB",
      "Wien 1100 Favoriten muayenehanesi",
      "Viyana Tabipler Odası üyesi",
      "Almanca ve Türkçe hasta bakımı",
      "Alerji teşhisi ve tedavisi",
    ],
  },
  qualifications: {
    de: [
      "Facharzt für HNO-Heilkunde",
      "Kinder-HNO und Hörstörungen",
      "Allergologie (Pricktest, Immuntherapie)",
      "Schwindel- und Gleichgewichtsdiagnostik",
      "Stimm- und Schluckstörungen",
    ],
    tr: [
      "KBB uzmanlığı",
      "Çocuk KBB ve işitme bozuklukları",
      "Alerji (prick testi, immünoterapi)",
      "Baş dönmesi ve denge teşhisi",
      "Ses ve yutma bozuklukları",
    ],
  },
  philosophy: {
    de: "Medizin bedeutet für mich Zuhören, Verstehen und gemeinsam den richtigen Weg finden. Ob Erwachsener oder Kind – jeder Patient verdient Zeit, Klarheit und eine Behandlung, die zu seinem Leben passt.",
    tr: "Tıp benim için dinlemek, anlamak ve birlikte doğru yolu bulmak demektir. Yetişkin veya çocuk – her hasta zaman, netlik ve hayatına uygun tedavi hak eder.",
  },
  usps: {
    de: ["Türkisch & Deutsch", "Kinder-HNO", "Akuttermine", "Alle Kassen"],
    tr: ["Türkçe & Almanca", "Çocuk KBB", "Acil randevu", "Tüm sigortalar"],
  },
};

// Resolved once at build time — dropped `as const` since the overlay's
// values are plain runtime strings (same reasoning as site.ts siteConfig).
export let doctorProfile = localDoctorProfile;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchDoctorProfile();
    if (!overlay) {
      sanityReadFailed("doctor-profile (doctor.dr-uemit-alici missing)", new Error("fetchDoctorProfile returned null"));
    }
    doctorProfile = {
      name: overlay.name || localDoctorProfile.name,
      portrait: overlay.portrait || localDoctorProfile.portrait,
      portraitPosition: overlay.portrait ? overlay.portraitPosition : localDoctorProfile.portraitPosition,
      tagline: overlay.tagline.de ? overlay.tagline : localDoctorProfile.tagline,
      clinicalTitle: overlay.clinicalTitle ?? localDoctorProfile.clinicalTitle,
      medicalSpecialties: overlay.medicalSpecialties ?? localDoctorProfile.medicalSpecialties,
      cv: overlay.cv.de.length ? overlay.cv : localDoctorProfile.cv,
      qualifications: overlay.qualifications.de.length ? overlay.qualifications : localDoctorProfile.qualifications,
      philosophy: overlay.philosophy.de ? overlay.philosophy : localDoctorProfile.philosophy,
      usps: overlay.usps.de.length ? overlay.usps : localDoctorProfile.usps,
    };
  } catch (e) {
    sanityReadFailed("doctor-profile", e);
  }
}

export const kassen = [
  {
    id: "oegk",
    name: "ÖGK",
    logo: "/images/insurance/oegk.svg",
    fullName: { de: "Österreichische Gesundheitskasse", tr: "Avusturya Sağlık Sigortası" },
    website: "https://www.gesundheitskasse.at/",
  },
  {
    id: "svs",
    name: "SVS",
    logo: "/images/insurance/svs.png",
    fullName: { de: "Sozialversicherung der Selbständigen", tr: "Serbest Meslek Sigortası" },
    website: "https://www.svs.at/",
  },
  {
    id: "bvaeb",
    name: "BVAEB",
    logo: "/images/insurance/bvaeb.png",
    fullName: { de: "Versicherungsanstalt öffentlich Bediensteter", tr: "Kamu Görevlileri Sigortası" },
    website: "https://www.bvaeb.at/",
  },
  {
    id: "kfa",
    name: "KFA",
    logo: "/images/insurance/kfa.png",
    fullName: { de: "Krankenfürsorgeanstalt der Bediensteten der Stadt Wien", tr: "Viyana Belediye Sağlık Kurumu" },
    website: "https://www.kfawien.at/",
  },
] as const;
