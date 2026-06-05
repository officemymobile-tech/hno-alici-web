export type LegalSection = {
  id?: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalDocument = {
  title: string;
  updated: string;
  sections: LegalSection[];
};
