export const reviewPlatforms = {
  google: {
    name: "Google",
    rating: 4.0,
    maxRating: 5,
    reviewCount: 70,
    url: "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
    writeReviewUrl:
      "https://www.google.com/maps/search/?api=1&query=HNO+Alici+Senefeldergasse+3+1100+Wien",
    mapsEmbedQuery: "Senefeldergasse+3/1,+1100+Wien,+HNO+Alici",
  },
  docfinder: {
    name: "DocFinder",
    rating: 4.2,
    maxRating: 5,
    reviewCount: 13,
    url: "https://www.docfinder.at/hno-arzt/1100-wien/dr-uemit-alici/bewertungen",
  },
  herold: {
    name: "Herold",
    rating: 4.9,
    maxRating: 5,
    reviewCount: 2,
    url: "https://www.herold.at/gelbe-seiten/wien/Gz9LR/dr-alici-uemit/",
  },
} as const;

export type ReviewItem = {
  id: string;
  rating: number;
  title: { de: string; tr: string };
  text: { de: string; tr: string };
  author: string;
  source: "google" | "docfinder" | "herold";
  locale?: "de" | "en";
};

export const patientReviews: ReviewItem[] = [
  {
    id: "1",
    rating: 5,
    title: { de: "Toller HNO-Arzt", tr: "Harika KBB doktoru" },
    text: {
      de: "Das Telefon hat nur einmal geläutet und schon wurde mein Anruf entgegengenommen. Die freundliche Assistentin hat mir gleich am selben Tag einen Termin gegeben. Kurze Wartezeit, einfühlsame Betreuung – sehr froh, zu Dr. Alici gegangen zu sein.",
      tr: "Telefon sadece bir kez çaldı ve aramam hemen karşılandı. Güler yüzlü asistan aynı gün randevu verdi. Kısa bekleme süresi, özenli bakım – Dr. Alici'ye gitmekten çok memnunum.",
    },
    author: "DocFinder Patient",
    source: "docfinder",
  },
  {
    id: "2",
    rating: 5,
    title: { de: "Professional and friendly", tr: "Profesyonel ve güler yüzlü" },
    text: {
      de: "Ich bin aus London und hatte akute Sinusprobleme. Dr. Ümit Alici und das Empfangsteam waren sehr freundlich und hilfsbereit. Ich musste kaum warten. Er erklärt alles verständlich und nimmt sich Zeit.",
      tr: "Londra'dan geldim ve akut sinüs sorunlarım vardı. Dr. Ümit Alici ve resepsiyon ekibi çok nazik ve yardımseverdi. Neredeyse hiç beklemedim. Her şeyi anlaşılır şekilde açıklıyor.",
    },
    author: "International Patient",
    source: "docfinder",
    locale: "en",
  },
  {
    id: "3",
    rating: 5,
    title: { de: "Ein super Arzt – nur zu empfehlen!", tr: "Mükemmel doktor – kesinlikle tavsiye!" },
    text: {
      de: "Ich bin sehr dankbar und fühle mich bestens aufgehoben. Kompetente Diagnostik und eine ruhige, vertrauensvolle Atmosphäre in der Ordination.",
      tr: "Çok minnettarım ve kendimi çok iyi hissediyorum. Yetkin teşhis ve muayenehanede sakin, güven veren bir ortam.",
    },
    author: "DocFinder Patient",
    source: "docfinder",
  },
  {
    id: "4",
    rating: 5,
    title: { de: "Soforthilfe bei akuten Beschwerden", tr: "Acil şikayetlerde anında yardım" },
    text: {
      de: "Toller Arzt und Perle von Ordinationshilfe! Soforthilfe bei akuten Beschwerden und Hörverlust. Eingeschoben, kaum Wartezeit, sehr gute Beratung. Nur zum Empfehlen!",
      tr: "Harika doktor ve muayenehane ekibi! Acil şikayetlerde ve işitme kaybında anında yardım. Hemen alındım, neredeyse beklemedim. Kesinlikle tavsiye ederim!",
    },
    author: "Herold Patient",
    source: "herold",
  },
  {
    id: "5",
    rating: 5,
    title: { de: "Der beste HNO!", tr: "En iyi KBB doktoru!" },
    text: {
      de: "Dr. Benjamin Alici ist äußerst kompetent, nett und ruhig. Lässt sich Zeit für die Patient:innen und beantwortet alle Fragen. Absolute Weiterempfehlung!",
      tr: "Dr. Benjamin Alici son derece yetkin, nazik ve sakin. Hastalar için zaman ayırıyor ve tüm soruları yanıtlıyor. Kesinlikle tavsiye ederim!",
    },
    author: "DocFinder Patient",
    source: "docfinder",
  },
  {
    id: "6",
    rating: 5,
    title: { de: "Einfach Spitze!", tr: "Gerçekten harika!" },
    text: {
      de: "Keine Wartezeit im Warteraum. Gründliche Untersuchung und verständliche Erklärung. Diesen Arzt kann ich nur weiterempfehlen.",
      tr: "Bekleme odasında bekleme yok. Kapsamlı muayene ve anlaşılır açıklama. Bu doktoru kesinlikle tavsiye ederim.",
    },
    author: "DocFinder Patient",
    source: "docfinder",
  },
];
