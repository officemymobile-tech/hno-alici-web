import type { LegalDocument } from "./types";

export const cookiesTr: LegalDocument = {
  title: "Çerez Politikası",
  updated: "Haziran 2026",
  sections: [
    {
      title: "Çerezler nedir?",
      paragraphs: [
        "Çerezler tarayıcıda saklanan küçük dosyalardır. Onay tercihiniz için localStorage kullanıyoruz.",
      ],
    },
    {
      title: "Genel bakış",
      list: [
        "<strong>Gerekli (localStorage):</strong> Gizlilik ayarlarınız.",
        "<strong>Harici medya (Google Maps):</strong> Yalnızca onay sonrası.",
        "<strong>Analitik:</strong> Kullanılmıyor.",
        "<strong>Pazarlama:</strong> Kullanılmıyor.",
      ],
      paragraphs: [],
    },
    {
      title: "Onayı geri çekme",
      paragraphs: [
        "Tarayıcı verilerini silerek veya datenschutz@hno-alici.at adresine yazarak onayınızı değiştirebilirsiniz.",
        "<a href=\"/tr/datenschutz\">Gizlilik politikası</a>",
      ],
    },
  ],
};
