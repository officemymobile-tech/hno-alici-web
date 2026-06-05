import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { seoLandings } from "@/content/seo-landings";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const data = seoLandings.turkishHno;
  return {
    title: data.title[lang],
    description: data.metaDescription[lang],
    keywords: [...data.keywords],
    alternates: {
      languages: { de: "/de/tuerkischer-hno-arzt-wien", tr: "/tr/turk-kbb-doktoru-wien" },
    },
  };
}

export default async function TurkishHnoLanding({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "de" | "tr";

  return (
    <>
      <SeoLandingTemplate
        data={seoLandings.turkishHno}
        lang={lang}
        locale={locale}
        serviceLink={`/${locale}/leistungen`}
      />
      <ReviewsSection compact />
      <GoogleBusinessCTA />
    </>
  );
}
