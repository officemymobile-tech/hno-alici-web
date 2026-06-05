import type { LegalDocument } from "./types";

export const privacyTr: LegalDocument = {
  title: "Gizlilik Politikası",
  updated: "Haziran 2026",
  sections: [
    {
      id: "verantwortlicher",
      title: "1. Veri sorumlusu",
      paragraphs: [
        "Bu web sitesindeki veri işlemeden sorumlu:",
        "<strong>Dr. Ümit Alici</strong><br>Kulak Burun Boğaz uzmanı<br>Senefeldergasse 3/1, 1100 Wien<br>E-posta: <a href=\"mailto:ordination@hno-alici.at\">ordination@hno-alici.at</a><br>Gizlilik: <a href=\"mailto:datenschutz@hno-alici.at\">datenschutz@hno-alici.at</a>",
      ],
    },
    {
      id: "aufsehen",
      title: "2. Denetim otoritesi",
      paragraphs: [
        "Avusturya Veri Koruma Otoritesi (DSB)<br>Barichgasse 40–42, 1030 Wien<br><a href=\"https://www.dsb.gv.at\" rel=\"noopener noreferrer\">www.dsb.gv.at</a>",
      ],
    },
    {
      id: "hosting",
      title: "3. Hosting ve sunucu günlükleri",
      paragraphs: [
        "Site <strong>Vercel Inc.</strong> üzerinde barındırılır (AB veri merkezi, Frankfurt). Ziyaret sırasında teknik olarak IP adresi, zaman, sayfa ve tarayıcı bilgisi işlenebilir. Hukuki dayanak: GDPR md. 6(1)(f).",
        "Vercel ile GDPR md. 28 uyarınca veri işleme sözleşmesi (DPA) yapılmıştır / yapılmalıdır.",
      ],
    },
    {
      id: "cookies",
      title: "4. Çerezler",
      paragraphs: [
        "Analiz veya pazarlama çerezi kullanılmaz. Yalnızca çerez tercihiniz localStorage'da saklanır.",
        "Google Maps yalnızca onayınızla yüklenir. Ayrıntılar: <a href=\"/tr/cookie-richtlinie\">Çerez politikası</a>.",
      ],
    },
    {
      id: "formular",
      title: "5. Randevu formu",
      paragraphs: [
        "Formda ad, telefon, isteğe bağlı e-posta ve mesaj işlenir. Gönderim mailto ile e-posta istemciniz üzerinden yapılır.",
        "<strong>Önemli:</strong> Formda <strong>sağlık verisi</strong> (semptom, tanı) paylaşmayın. Acil durumlarda telefon edin.",
        "Saklama: talep tamamlanana kadar, en fazla 12 ay.",
      ],
    },
    {
      id: "gesundheitsdaten",
      title: "6. Sağlık verileri",
      paragraphs: [
        "Bu site sağlık verisi iletimi için tasarlanmamıştır. Sağlık verileri yalnızca muayenehanede tedavi kapsamında işlenir (GDPR md. 9).",
      ],
    },
    {
      id: "externe",
      title: "7. Harici hizmetler",
      paragraphs: [
        "Google Maps yalnızca onay sonrası. Google gizlilik politikası geçerlidir.",
        "Yazı tipleri next/font ile yerel olarak sunulur.",
      ],
    },
    {
      id: "bilder",
      title: "8. Görseller",
      paragraphs: [
        "Bazı görseller gerçek fotoğraflardan yapay zeka ile iyileştirilmiştir. Hasta fotoğrafı yayınlanmaz.",
      ],
    },
    {
      id: "rechte",
      title: "9. Haklarınız",
      paragraphs: [
        "Erişim, düzeltme, silme, itiraz ve şikâyet haklarınız vardır: <a href=\"mailto:datenschutz@hno-alici.at\">datenschutz@hno-alici.at</a>",
      ],
    },
  ],
};
