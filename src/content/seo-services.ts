import { images } from "./site-content";
import type { ServiceSlug } from "@/lib/site";
import { isSanityContentEnabled, sanityReadFailed } from "@/lib/content-source";
import { fetchServices } from "@/lib/sanity/queries";

export type SeoServiceContent = {
  slug: ServiceSlug;
  h1: { de: string; tr: string };
  // Bare service name (no location suffix) for nav/menu/card titles — `h1`
  // includes "Wien 1100" and is meant for the detail page only. Pre-seeded
  // with the exact text already live in messages.services.*.title.
  shortTitle: { de: string; tr: string };
  // Short card blurb for the homepage preview and the Leistungen mega-menu —
  // deliberately shorter than `intro` (the detail page's opening paragraph).
  // Pre-seeded with the exact text that was already live in
  // messages/{de,tr}.json's services.* keys (not invented) so switching
  // ServicesPreview/ServicesMegaMenu/the overview grid to read this field
  // instead doesn't change a single visible word.
  cardText: { de: string; tr: string };
  metaTitle: { de: string; tr: string };
  metaDescription: { de: string; tr: string };
  keywords: { de: string[]; tr: string[] };
  intro: { de: string; tr: string };
  symptoms: { de: string[]; tr: string[] };
  treatments: { de: string[]; tr: string[] };
  faq: { q: { de: string; tr: string }; a: { de: string; tr: string } }[];
  image: string;
  imagePosition?: string;
};

const localSeoServices: Record<ServiceSlug, SeoServiceContent> = {
  "allgemeine-hno": {
    slug: "allgemeine-hno",
    h1: { de: "Allgemeine HNO Wien 1100", tr: "Genel KBB Wien 1100" },
    shortTitle: { de: "Allgemeine HNO", tr: "Genel KBB" },
    cardText: {
      de: "Diagnostik und Behandlung von Erkrankungen der Nase, der Ohren und des Halses – von Infekten bis zu chronischen Beschwerden.",
      tr: "Burun, kulak ve boğaz hastalıklarının teşhisi ve tedavisi – enfeksiyonlardan kronik şikayetlere kadar.",
    },
    metaTitle: { de: "Allgemeine HNO Wien Favoriten", tr: "Genel KBB Wien Favoriten" },
    metaDescription: {
      de: "Allgemeine HNO-Untersuchungen in Wien 1100: Ohren, Nase, Hals, Hörtest, Schwindel. Alle Kassen. Akuttermine möglich.",
      tr: "Wien 1100'de genel KBB muayeneleri: kulak, burun, boğaz, işitme testi. Tüm sigortalar. Acil randevular.",
    },
    keywords: { de: ["HNO Wien", "HNO Arzt Wien", "HNO 1100"], tr: ["KBB Wien", "KBB doktoru Wien"] },
    intro: {
      de: "In unserer HNO-Ordination in Wien Favoriten diagnostizieren und behandeln wir das gesamte Spektrum der Hals-, Nasen- und Ohrenheilkunde für Erwachsene.",
      tr: "Wien Favoriten'deki KBB muayenehanemizde yetişkinler için kulak, burun ve boğaz hastalıklarının tamamını teşhis ve tedavi ediyoruz.",
    },
    symptoms: {
      de: ["Ohrenschmerzen", "Hörverlust", "Nasenverstopfung", "Heiserkeit", "Halsschmerzen", "Schwindel"],
      tr: ["Kulak ağrısı", "İşitme kaybı", "Burun tıkanıklığı", "Ses kısıklığı", "Boğaz ağrısı", "Baş dönmesi"],
    },
    treatments: {
      de: ["Audiometrie", "Tympanometrie", "Endoskopie", "Medikamentöse Therapie", "Akutversorgung"],
      tr: ["Odyometri", "Timpanometri", "Endoskopi", "İlaç tedavisi", "Acil bakım"],
    },
    faq: [
      { q: { de: "Brauche ich eine Überweisung?", tr: "Sevk gerekli mi?" }, a: { de: "Für Kassenpatienten in der Regel ja.", tr: "Sigortalı hastalar için genellikle evet." } },
    ],
    image: images.leistungenFoto09,
  },
  "kinder-hno": {
    slug: "kinder-hno",
    h1: { de: "Kinder HNO Wien 1100", tr: "Çocuk KBB Wien 1100" },
    shortTitle: { de: "Kinder-HNO", tr: "Çocuk KBB" },
    cardText: {
      de: "Spezialisierte Versorgung für Kinder: Ohrenschmerzen, Polypen, Hörprobleme und wiederkehrende Infekte – einfühlsam und altersgerecht.",
      tr: "Çocuklar için özel bakım: kulak ağrısı, polip, işitme sorunları ve tekrarlayan enfeksiyonlar – nazik ve yaşa uygun.",
    },
    metaTitle: { de: "Kinder HNO Wien Favoriten", tr: "Çocuk KBB Wien Favoriten" },
    metaDescription: {
      de: "Kinder-HNO in Wien 1100: Ohrenschmerzen, Hörprobleme, Schnupfen. Einfühlsame Betreuung. Termin am gleichen Tag bei Akutfällen.",
      tr: "Wien 1100 çocuk KBB: kulak ağrısı, işitme sorunları. Nazik bakım. Acil durumlarda aynı gün randevu.",
    },
    keywords: { de: ["Kinder HNO Wien", "Kinder HNO 1100", "HNO Kind Wien"], tr: ["Çocuk KBB Wien", "Çocuk KBB 1100"] },
    intro: {
      de: "Kinder-HNO ist ein Schwerpunkt unserer Ordination. Wir nehmen uns besonders viel Zeit für unsere jüngsten Patienten.",
      tr: "Çocuk KBB muayenehanemizin odak noktasıdır. En küçük hastalarımız için özellikle zaman ayırıyoruz.",
    },
    symptoms: {
      de: ["Ohrenschmerzen", "Hörstörungen", "Dauerschnupfen", "Schnarchen", "Sprachentwicklungsverzögerung"],
      tr: ["Kulak ağrısı", "İşitme bozuklukları", "Sürekli burun akıntısı", "Horlama", "Konuşma gecikmesi"],
    },
    treatments: {
      de: ["Kindgerechte Untersuchung", "Ohrreinigung", "Hörscreening", "Akuttermine am gleichen Tag"],
      tr: ["Çocuğa uygun muayene", "Kulak temizliği", "İşitme taraması", "Aynı gün acil randevu"],
    },
    faq: [
      { q: { de: "Ab welchem Alter?", tr: "Hangi yaştan itibaren?" }, a: { de: "Von Säuglingen bis Jugendliche.", tr: "Bebeklerden gençlere kadar." } },
    ],
    image: images.leistungenOverview,
  },
  allergologie: {
    slug: "allergologie",
    h1: { de: "Allergietest Wien", tr: "Alerji testi Wien" },
    shortTitle: { de: "Allergologie", tr: "Alerji" },
    cardText: {
      de: "Abklärung und Behandlung allergischer Beschwerden der oberen Atemwege – für mehr Lebensqualität im Alltag.",
      tr: "Üst solunum yolu alerjik şikayetlerinin araştırılması ve tedavisi – günlük yaşam kalitesi için.",
    },
    metaTitle: { de: "Allergietest Wien 1100", tr: "Alerji testi Wien 1100" },
    metaDescription: {
      de: "Allergieabklärung in Wien Favoriten: Pricktest, Blutuntersuchung, Immuntherapie. HNO-Facharzt Dr. Ümit Alici.",
      tr: "Wien Favoriten'de alerji araştırması: prick testi, kan testi, immünoterapi.",
    },
    keywords: { de: ["Allergietest Wien", "Allergie Wien 1100", "HNO Allergie"], tr: ["Alerji testi Wien", "Alerji Wien"] },
    intro: {
      de: "Bei Allergiesymptomatik der Nase, Augen und des Rachens führen wir umfassende Allergietests durch.",
      tr: "Burun, göz ve boğaz alerji belirtilerinde kapsamlı alerji testleri yapıyoruz.",
    },
    symptoms: {
      de: ["Niesen", "Juckreiz", "Tränende Augen", "Verstopfte Nase", "Rachenjucken"],
      tr: ["Hapşırma", "Kaşıntı", "Göz sulanması", "Burun tıkanıklığı", "Boğaz kaşıntısı"],
    },
    treatments: {
      de: ["Pricktest", "Blutuntersuchung", "Spezifische Immuntherapie", "Medikamentöse Therapie"],
      tr: ["Prick testi", "Kan testi", "Spesifik immünoterapi", "İlaç tedavisi"],
    },
    faq: [],
    image: images.leistungenFoto10,
  },
  hoertest: {
    slug: "hoertest",
    h1: { de: "Hörtest Wien", tr: "İşitme testi Wien" },
    shortTitle: { de: "Hörtest", tr: "İşitme testi" },
    cardText: {
      de: "Hörprüfungen und Abklärung von Hörverlust, Tinnitus und anderen Hörstörungen.",
      tr: "İşitme testleri ve işitme kaybı, tinnitus ve diğer işitme bozukluklarının araştırılması.",
    },
    metaTitle: { de: "Hörtest & Hörmessung Wien 1100", tr: "İşitme testi Wien 1100" },
    metaDescription: { de: "Hörtest und Audiometrie in Wien Favoriten. Hörverlust, Tinnitus Abklärung.", tr: "Wien Favoriten'de işitme testi ve odyometri." },
    keywords: { de: ["Hörtest Wien", "Hörmessung Wien"], tr: ["İşitme testi Wien"] },
    intro: { de: "Moderne Hördiagnostik für Erwachsene und Kinder in unserer HNO-Ordination.", tr: "Muayenehanemizde yetişkin ve çocuklar için modern işitme teşhisi." },
    symptoms: { de: ["Hörverlust", "Tinnitus", "Ohrgeräusche", "Verständnisprobleme"], tr: ["İşitme kaybı", "Tinnitus", "Kulak çınlaması"] },
    treatments: { de: ["Audiometrie", "Tympanometrie", "OAE Hörscreening"], tr: ["Odyometri", "Timpanometri", "OAE taraması"] },
    faq: [],
    image: images.leistungenFoto09,
  },
  schwindel: {
    slug: "schwindel",
    h1: { de: "Schwindel Abklärung Wien", tr: "Baş dönmesi araştırması Wien" },
    shortTitle: { de: "Schwindel", tr: "Baş dönmesi" },
    cardText: {
      de: "Diagnostik von Schwindel und Gleichgewichtsstörungen mit gezielter HNO-Abklärung.",
      tr: "Baş dönmesi ve denge bozukluklarının hedefli KBB araştırması.",
    },
    metaTitle: { de: "Schwindel Wien 1100", tr: "Baş dönmesi Wien 1100" },
    metaDescription: { de: "Schwindel und Gleichgewichtsstörungen – HNO-Abklärung in Wien Favoriten.", tr: "Baş dönmesi ve denge bozuklukları – KBB araştırması Wien Favoriten." },
    keywords: { de: ["Schwindel Wien", "Schwindel Arzt Wien"], tr: ["Baş dönmesi Wien"] },
    intro: { de: "Schwindel hat viele Ursachen – wir klären HNO-relevante Formen gezielt ab.", tr: "Baş dönmesinin birçok nedeni vardır – KBB ile ilgili formları hedefli araştırıyoruz." },
    symptoms: { de: ["Drehschwindel", "Benommenheit", "Gleichgewichtsstörungen"], tr: ["Dönme hissi", "Sersemlik", "Denge bozuklukları"] },
    treatments: { de: ["HNO-Diagnostik", "Gleichgewichtsprüfung", "Therapieplanung"], tr: ["KBB teşhisi", "Denge testi", "Tedavi planı"] },
    faq: [],
    image: images.leistungenFoto10,
  },
  schnarchen: {
    slug: "schnarchen",
    h1: { de: "Schnarchen Behandlung Wien", tr: "Horlama tedavisi Wien" },
    shortTitle: { de: "Schnarchen", tr: "Horlama" },
    cardText: {
      de: "Abklärung und Behandlung von Schnarchen und schlafbezogenen Atemproblemen.",
      tr: "Horlama ve uykuyla ilgili solunum sorunlarının araştırılması ve tedavisi.",
    },
    metaTitle: { de: "Schnarchen Wien 1100", tr: "Horlama Wien 1100" },
    metaDescription: { de: "Schnarchen und schlafbezogene Atemprobleme – Abklärung beim HNO-Facharzt.", tr: "Horlama ve uyku solunum sorunları – KBB uzmanında araştırma." },
    keywords: { de: ["Schnarchen Wien", "Schnarchen Arzt Wien"], tr: ["Horlama tedavisi Wien"] },
    intro: { de: "Schnarchen beeinträchtigt die Lebensqualität – wir finden die Ursache und empfehlen die passende Therapie.", tr: "Horlama yaşam kalitesini etkiler – nedeni bulur ve uygun tedaviyi öneririz." },
    symptoms: { de: ["Lautes Schnarchen", "Atemaussetzer", "Tagesmüdigkeit"], tr: ["Yüksek sesle horlama", "Nefes durmaları", "Gündüz yorgunluğu"] },
    treatments: { de: ["Nasen- und Rachenuntersuchung", "Therapieempfehlung", "Weiterleitung bei Bedarf"], tr: ["Burun ve boğaz muayenesi", "Tedavi önerisi"] },
    faq: [],
    image: images.leistungenFoto10,
  },
  stimmstoerungen: {
    slug: "stimmstoerungen",
    h1: { de: "Stimmstörungen Wien", tr: "Ses bozuklukları Wien" },
    shortTitle: { de: "Stimmstörungen", tr: "Ses bozuklukları" },
    cardText: {
      de: "Untersuchung und Therapie von Heiserkeit und funktionellen Stimmproblemen.",
      tr: "Ses kısıklığı ve fonksiyonel ses sorunlarının muayenesi ve tedavisi.",
    },
    metaTitle: { de: "Stimmstörungen & Heiserkeit Wien 1100", tr: "Ses bozuklukları Wien 1100" },
    metaDescription: { de: "Heiserkeit und Stimmprobleme – Diagnostik und Therapie beim HNO-Facharzt.", tr: "Ses kısıklığı ve ses sorunları – KBB uzmanında teşhis ve tedavi." },
    keywords: { de: ["Stimmstörungen Wien", "Heiserkeit Arzt Wien"], tr: ["Ses bozuklukları Wien"] },
    intro: { de: "Stimmstörungen können Beruf und Alltag beeinträchtigen – wir untersuchen Ursachen am Kehlkopf und in den Stimmbändern.", tr: "Ses bozuklukları meslek ve günlük yaşamı etkileyebilir – gırtlak ve ses tellerini inceliyoruz." },
    symptoms: { de: ["Heiserkeit", "Stimmverlust", "Räusperzwang", "Stimmermüdung"], tr: ["Ses kısıklığı", "Ses kaybı", "Boğaz temizleme ihtiyacı"] },
    treatments: { de: ["Stimmdiagnostik", "Endoskopie", "Therapie & Stimmhygiene"], tr: ["Ses teşhisi", "Endoskopi", "Tedavi ve ses hijyeni"] },
    faq: [],
    image: images.drAliciPortrait,
  },
};

// Resolved once at build time, merged per-slug (not wholesale replaced) so a
// Sanity service document only overrides the fields it actually sets, same
// merge discipline as editable-content.ts's texts overlay.
export let seoServices: Record<ServiceSlug, SeoServiceContent> = localSeoServices;
if (isSanityContentEnabled()) {
  try {
    const overlay = await fetchServices();
    if (!overlay.length) {
      sanityReadFailed("seo-services (fetchServices returned 0 documents)", new Error("expected 7 service documents"));
    }
    const merged = { ...localSeoServices };
    for (const s of overlay) {
      const slug = s.slug as ServiceSlug;
      if (slug in merged) {
        merged[slug] = {
          ...merged[slug],
          ...s,
          // `shortTitle`/`cardText` are optional on the overlay (undefined
          // when not yet set in Sanity) — a blind spread would otherwise
          // overwrite the real local values with `undefined` the moment
          // Sanity mode is enabled, before any editor has touched these
          // 2 new fields.
          shortTitle: s.shortTitle ?? merged[slug].shortTitle,
          cardText: s.cardText ?? merged[slug].cardText,
          imagePosition: s.imagePosition ?? merged[slug].imagePosition,
          slug,
        };
      }
    }
    seoServices = merged;
  } catch (e) {
    sanityReadFailed("seo-services", e);
  }
}
