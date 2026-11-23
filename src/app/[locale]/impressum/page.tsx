import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/content/legal";
import { getPageSeo } from "@/lib/page-seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDocument("impressum", locale);
  const { title, description } = await getPageSeo("impressum", locale as "de" | "tr", {
    title: doc.title,
    description:
      locale === "tr"
        ? "Wien Favoriten'deki Dr. Ümit Alici KBB muayenehanesinin yasal bilgileri (İmpressum)."
        : "Impressum und Anbieterkennzeichnung der HNO-Ordination Dr. Ümit Alici in Wien Favoriten.",
  });
  return { title, description };
}

export default async function ImprintPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDocument("impressum", locale);

  return (
    <>
      <PageHeader title={doc.title} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <LegalDocument document={doc} />
      </div>
    </>
  );
}
