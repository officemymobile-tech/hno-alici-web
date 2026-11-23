import { isSanityContentEnabled, sanityReadFailed } from "@/lib/content-source";
import { fetchGeneralFaq } from "@/lib/sanity/queries";

export type GeneralFaqItem = { q: { de: string; tr: string }; a: { de: string; tr: string } };

// Pre-seeded with the exact text already live in messages/{de,tr}.json's
// patientInfo.faq.items (not invented) — used by both the homepage FaqSection
// and /patienteninfo, same single source either way. Deliberately distinct
// from each service's own `service.faq` (service-specific questions): this
// is the site's general FAQ (referrals, acute appointments, languages), a
// legitimate separate content set, not a duplicate.
const localGeneralFaq: GeneralFaqItem[] = [
  {
    q: { de: "Brauche ich eine Überweisung?", tr: "Sevk gerekli mi?" },
    a: {
      de: "Für Kassenpatienten ist in der Regel eine Überweisung vom Haus- oder Kinderarzt erforderlich. Bei akuten Beschwerden kontaktieren Sie uns gerne telefonisch.",
      tr: "Sigortalı hastalar için genellikle aile veya çocuk doktorundan sevk gerekir. Acil şikayetlerde bizi telefonla arayın.",
    },
  },
  {
    q: { de: "Gibt es Akuttermine?", tr: "Acil randevu var mı?" },
    a: {
      de: "Ja. Bei akuten HNO-Beschwerden versuchen wir, zeitnahe Termine anzubieten. Rufen Sie uns am besten direkt an.",
      tr: "Evet. Acil KBB şikayetlerinde kısa sürede randevu vermeye çalışıyoruz. En iyisi doğrudan aramaktır.",
    },
  },
  {
    q: { de: "Werden Kinder behandelt?", tr: "Çocuklar tedavi ediliyor mu?" },
    a: {
      de: "Ja. Kinder-HNO ist ein Schwerpunkt unserer Ordination. Wir nehmen uns besonders viel Zeit für unsere jüngsten Patienten.",
      tr: "Evet. Çocuk KBB muayenehanemizin odak noktasıdır. En küçük hastalarımız için özellikle zaman ayırıyoruz.",
    },
  },
  {
    q: { de: "Wird Türkisch gesprochen?", tr: "Türkçe konuşuluyor mu?" },
    a: {
      de: "Ja. Dr. Ümit Alici berät und behandelt auf Deutsch und Türkisch.",
      tr: "Evet. Dr. Ümit Alici Almanca ve Türkçe danışmanlık ve tedavi sunar.",
    },
  },
];

export let generalFaq: GeneralFaqItem[] = localGeneralFaq;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchGeneralFaq();
    if (overlay.length) generalFaq = overlay;
  } catch (e) {
    sanityReadFailed("general-faq", e);
  }
}
