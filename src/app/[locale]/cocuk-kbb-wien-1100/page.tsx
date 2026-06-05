import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { seoLandings } from "@/content/seo-landings";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Çocuk KBB Wien 1100 | Dr. Ümit Alici",
  description: seoLandings.kinderHno.metaDescription.tr,
  keywords: [...seoLandings.kinderHno.keywords],
};

export default async function KinderHnoLandingTr({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SeoLandingTemplate
        data={seoLandings.kinderHno}
        lang="tr"
        locale={locale}
        serviceLink={`/${locale}/leistungen/kinder-hno`}
      />
      <GoogleBusinessCTA />
    </>
  );
}
