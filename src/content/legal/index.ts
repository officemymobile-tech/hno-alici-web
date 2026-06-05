import type { LegalDocument } from "./types";
import { privacyDe } from "./privacy-de";
import { privacyTr } from "./privacy-tr";
import { cookiesDe } from "./cookies-de";
import { cookiesTr } from "./cookies-tr";
import { impressumDe } from "./impressum-de";
import { impressumTr } from "./impressum-tr";
import { haftungDe } from "./haftung-de";
import { haftungTr } from "./haftung-tr";

export type LegalPageKey = "privacy" | "cookies" | "impressum" | "haftung";

const documents: Record<LegalPageKey, Record<"de" | "tr", LegalDocument>> = {
  privacy: { de: privacyDe, tr: privacyTr },
  cookies: { de: cookiesDe, tr: cookiesTr },
  impressum: { de: impressumDe, tr: impressumTr },
  haftung: { de: haftungDe, tr: haftungTr },
};

export function getLegalDocument(page: LegalPageKey, locale: string): LegalDocument {
  const lang = locale === "tr" ? "tr" : "de";
  return documents[page][lang];
}
