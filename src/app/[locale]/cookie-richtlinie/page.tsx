import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/content/legal";
import { getPageSeo } from "@/lib/page-seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDocument("cookies", locale);
  const { title, description } = await getPageSeo("cookie-richtlinie", locale as "de" | "tr", {
    title: doc.title,
    description:
      locale === "tr"
        ? "Dr. Ümit Alici KBB muayenehanesi web sitesinde hangi çerezleri kullandığımız ve tercihlerinizi nasıl yönetebileceğiniz."
        : "Cookie-Richtlinie der HNO-Ordination Dr. Ümit Alici – welche Cookies wir verwenden und wie Sie Ihre Einstellungen verwalten.",
  });
  return { title, description };
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDocument("cookies", locale);

  return (
    <>
      <PageHeader title={doc.title} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <LegalDocument document={doc} />
      </div>
    </>
  );
}
