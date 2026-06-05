import type { LegalDocument } from "./types";

export const haftungTr: LegalDocument = {
  title: "Sorumluluk Reddi ve Tıbbi Uyarı",
  updated: "Haziran 2026",
  sections: [
    {
      title: "Uzaktan tedavi yok",
      paragraphs: [
        "Bu site bilgilendirme amaçlıdır; muayene, teşhis veya tedavinin yerine geçmez.",
        "Tıbbi danışmanlık yalnızca muayenehanede veya telefonla yapılır.",
      ],
    },
    {
      title: "Acil durum",
      paragraphs: [
        "Hayati tehlike durumunda <strong>144</strong> (Avusturya acil) arayın veya acil servise gidin.",
      ],
    },
    {
      title: "İçerik doğruluğu",
      paragraphs: [
        "Bilgilerin güncelliği için çaba gösterilir; garanti verilmez.",
      ],
    },
    {
      title: "Harici bağlantılar",
      paragraphs: [
        "Harici sitelerin içeriğinden sorumlu değiliz.",
      ],
    },
    {
      title: "Telif ve görseller",
      paragraphs: [
        "Bazı görseller yapay zeka ile iyileştirilmiştir.",
      ],
    },
  ],
};
