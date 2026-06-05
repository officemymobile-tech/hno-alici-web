import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { seoLandings } from "@/content/seo-landings";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "Türk KBB Doktoru Wien | Dr. Ümit Alici",
  description: seoLandings.turkishHno.metaDescription.tr,
  keywords: [...seoLandings.turkishHno.keywords],
};

export default async function TurkishHnoLandingTr({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SeoLandingTemplate
        data={seoLandings.turkishHno}
        lang="tr"
        locale={locale}
        serviceLink={`/${locale}/leistungen`}
      />
      <ReviewsSection compact />
      <GoogleBusinessCTA />
    </>
  );
}
