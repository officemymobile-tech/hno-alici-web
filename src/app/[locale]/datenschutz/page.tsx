import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/content/legal";
import { getPageSeo } from "@/lib/page-seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDocument("privacy", locale);
  const { title, description } = await getPageSeo("datenschutz", locale as "de" | "tr", {
    title: doc.title,
    description:
      locale === "tr"
        ? "Dr. Ümit Alici KBB muayenehanesinin kişisel verilerinizin işlenmesine ilişkin gizlilik politikası."
        : "Datenschutzerklärung der HNO-Ordination Dr. Ümit Alici – Informationen zur Verarbeitung Ihrer personenbezogenen Daten.",
  });
  return { title, description };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDocument("privacy", locale);

  return (
    <>
      <PageHeader title={doc.title} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <LegalDocument document={doc} />
      </div>
    </>
  );
}
