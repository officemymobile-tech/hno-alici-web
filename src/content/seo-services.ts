import { images } from "./site-content";
import type { ServiceSlug } from "@/lib/site";

export type SeoServiceContent = {
  slug: ServiceSlug;
  h1: { de: string; tr: string };
  metaTitle: { de: string; tr: string };
  metaDescription: { de: string; tr: string };
  keywords: { de: string[]; tr: string[] };
  intro: { de: string; tr: string };
  symptoms: { de: string[]; tr: string[] };
  treatments: { de: string[]; tr: string[] };
  faq: { q: { de: string; tr: string }; a: { de: string; tr: string } }[];
  image: string;
};

export const seoServices: Record<ServiceSlug, SeoServiceContent> = {
  "allgemeine-hno": {
    slug: "allgemeine-hno",
    h1: { de: "Allgemeine HNO Wien 1100", tr: "Genel KBB Wien 1100" },
    metaTitle: { de: "Allgemeine HNO Wien Favoriten | Dr. Ümit Alici", tr: "Genel KBB Wien Favoriten | Dr. Ümit Alici" },
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
    metaTitle: { de: "Kinder HNO Wien Favoriten | Dr. Ümit Alici", tr: "Çocuk KBB Wien Favoriten | Dr. Ümit Alici" },
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
    metaTitle: { de: "Allergietest Wien 1100 | HNO Alici", tr: "Alerji testi Wien 1100 | HNO Alici" },
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
    metaTitle: { de: "Schwindel Wien 1100 | HNO Facharzt", tr: "Baş dönmesi Wien 1100 | KBB uzmanı" },
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
    metaTitle: { de: "Schnarchen Wien 1100 | HNO Alici", tr: "Horlama Wien 1100 | HNO Alici" },
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
