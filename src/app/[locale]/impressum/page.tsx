import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/content/legal";

type Props = { params: Promise<{ locale: string }> };

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
