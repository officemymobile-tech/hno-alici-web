import type { LegalDocument } from "./types";
import { privacyDe } from "./privacy-de";
import { privacyTr } from "./privacy-tr";
import { cookiesDe } from "./cookies-de";
import { cookiesTr } from "./cookies-tr";
import { impressumDe } from "./impressum-de";
import { impressumTr } from "./impressum-tr";
import { haftungDe } from "./haftung-de";
import { haftungTr } from "./haftung-tr";
import { isSanityContentEnabled, sanityReadFailed } from "@/lib/content-source";
import { fetchLegalDocument } from "@/lib/sanity/queries";

export type LegalPageKey = "privacy" | "cookies" | "impressum" | "haftung";

const localDocuments: Record<LegalPageKey, Record<"de" | "tr", LegalDocument>> = {
  privacy: { de: privacyDe, tr: privacyTr },
  cookies: { de: cookiesDe, tr: cookiesTr },
  impressum: { de: impressumDe, tr: impressumTr },
  haftung: { de: haftungDe, tr: haftungTr },
};

// Resolved once at build time. IMPORTANT (binding condition 2): the Phase
// 4.1a migration script copies legal text byte-for-byte from these local
// files — wording is never generated or altered here. This overlay exists so
// legal content becomes editable through Studio going forward, not to
// change what it currently says.
const documents = { ...localDocuments };
if (isSanityContentEnabled()) {
  for (const page of Object.keys(localDocuments) as LegalPageKey[]) {
    for (const lang of ["de", "tr"] as const) {
      try {
        const overlay = await fetchLegalDocument(page, lang);
        if (overlay) documents[page] = { ...documents[page], [lang]: overlay };
      } catch (e) {
        sanityReadFailed(`legal/${page}/${lang}`, e);
      }
    }
  }
}

export function getLegalDocument(page: LegalPageKey, locale: string): LegalDocument {
  const lang = locale === "tr" ? "tr" : "de";
  return documents[page][lang];
}
