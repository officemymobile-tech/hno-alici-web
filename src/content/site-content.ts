import type { IconKey } from "@/components/icons/ServiceIcon";

export const images = {
  logo: "/images/logo.png",
  logoIcon: "/images/logo-icon.png",
  logoDrUmit: "/images/logo-dr-umit.png",
  iconGeneral: "/images/icon-allgemeine-hno.png",
  iconChildren: "/images/icon-kinder-hno.png",
  iconAllergy: "/images/icon-allergie.png",
  iconHealth: "/images/icon-health.png",
  ordinationHero: "/images/pro/ordination-hero-pro.jpg",
  ordinationBanner: "/images/ordination-banner.jpg",
  drAliciPortrait: "/images/pro/dr-alici-portrait-pro.jpg",
  drMeierPortrait: "/images/pro/dr-meier-pro.jpg",
  leistungenFoto09: "/images/pro/leistungen-foto-09-pro.jpg",
  leistungenFoto10: "/images/pro/leistungen-foto-10-pro.jpg",
  leistungenOverview: "/images/pro/leistungen-overview-pro.jpg",
  teamFrAlici: "/images/pro/team-fr-alici-pro.jpg",
  googleMap: "/images/google-map.jpg",
} as const;

export const doctors = [
  {
    name: "Dr. Ümit Alici",
    title: { de: "Facharzt für Hals-, Nasen- u. Ohrenheilkunde", tr: "Kulak Burun Boğaz Uzmanı" },
    primary: true,
  },
  {
    name: "Dr. Sigrid Meier",
    title: { de: "Fachärztin für Hals-, Nasen- u. Ohrenheilkunde", tr: "KBB Uzmanı" },
    primary: false,
  },
  {
    name: "Dr. Benjamin Alici",
    title: { de: "Facharzt für Hals-, Nasen- u. Ohrenheilkunde", tr: "KBB Uzmanı" },
    primary: false,
  },
] as const;

export const teamStaff = [
  { name: "Frau Ruzica Tadic", role: { de: "Ordinationsmanagerin", tr: "Muayenehane Müdürü" } },
  { name: "Frau Hatice Yildizdal", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Yaren Sertelli", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Melissa Baran", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Naila Memic", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Aya Halabia", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Melike Arslan", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Herr David Kanji Zach-Kiesling", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
  { name: "Frau Marielle Bahome", role: { de: "Ordinationsteam", tr: "Ordinationsteam" } },
] as const;

export const facebookUrl = "https://de-de.facebook.com/HNO.ALICI/";

export const leistungenContent = {
  intro: {
    de: "Sämtliche akute und chronische Erkrankungen im HNO Bereich werden diagnostiziert und behandelt.",
    tr: "KBB alanındaki tüm akut ve kronik hastalıklar teşhis edilir ve tedavi edilir.",
  },
  acuteNote: {
    de: "Bei akuten Beschwerden vergeben wir sehr kurzfristige Termine!",
    tr: "Acil şikayetlerde çok kısa sürede randevu veriyoruz!",
  },
  sections: [
    {
      id: "allgemeine-hno",
      iconKey: "general-hno" as IconKey,
      image: images.leistungenFoto09,
      title: { de: "Allgemeine HNO Untersuchungen", tr: "Genel KBB Muayeneleri" },
      description: {
        de: "Untersuchung und Behandlung der Ohren, des Gehörs, der Gleichgewichtsorgane, der Nase, des Nasenrachens und des Kehlkopfes",
        tr: "Kulaklar, işitme, denge organları, burun, nazofarenks ve gırtlak muayenesi ve tedavisi",
      },
      items: {
        de: [
          "Audiometrie (Hörmessung)",
          "Tympanometrie",
          "Hörscreening (OAE)",
          "Schluckprobleme",
          "Speicheldrüsenerkrankungen",
          "Stimmstörungen",
          "Schnarchen",
          "Schwindelabklärung",
        ],
        tr: [
          "Odyometri (işitme ölçümü)",
          "Timpanometri",
          "İşitme taraması (OAE)",
          "Yutma sorunları",
          "Tükürük bezi hastalıkları",
          "Ses bozuklukları",
          "Horlama",
          "Baş dönmesi araştırması",
        ],
      },
    },
    {
      id: "kinder-hno",
      iconKey: "children" as IconKey,
      image: images.leistungenOverview,
      title: { de: "Kinder HNO", tr: "Çocuk KBB" },
      subtitle: {
        de: "Terminvergabe am gleichen Tag bei akuten Beschwerden.",
        tr: "Acil şikayetlerde aynı gün randevu.",
      },
      items: {
        de: [
          "Hörstörungen",
          "Akute Atemwegsinfekte",
          "Sprachentwicklungsverzögerung",
          "Dauerschnupfen, Schnarchen",
          "Ohrenschmerzen",
          "Ohrreinigung",
        ],
        tr: [
          "İşitme bozuklukları",
          "Akut solunum yolu enfeksiyonları",
          "Konuşma gelişim gecikmesi",
          "Sürekli burun akıntısı, horlama",
          "Kulak ağrısı",
          "Kulak temizliği",
        ],
      },
    },
    {
      id: "allergologie",
      iconKey: "allergy" as IconKey,
      image: images.leistungenFoto10,
      title: { de: "Allergieabklärung", tr: "Alerji Araştırması" },
      description: {
        de: "Bei Patienten mit Allergiesymptomatik der Nase, Augen und Rachen führen wir einen Allergietest durch.",
        tr: "Burun, göz ve boğaz alerji belirtileri olan hastalarda alerji testi yapıyoruz.",
      },
      items: {
        de: [
          "Hauttest – Pricktest",
          "Blutuntersuchung",
          "Spezifische Immuntherapie",
          "Medikamentöse Therapie",
        ],
        tr: [
          "Cilt testi – Prick testi",
          "Kan testi",
          "Spesifik immünoterapi",
          "İlaç tedavisi",
        ],
      },
    },
  ],
} as const;

export const kontaktContent = {
  appointmentNote: {
    de: "Terminvereinbarungen bitte telefonisch",
    tr: "Randevular lütfen telefonla",
  },
  reachable: {
    de: "An diesen Tagen sind wir erreichbar",
    tr: "Bu günlerde bize ulaşabilirsiniz",
  },
} as const;
