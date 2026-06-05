import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { seoLandings } from "@/content/seo-landings";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const data = seoLandings.kinderHno;
  return {
    title: data.title[lang],
    description: data.metaDescription[lang],
    keywords: [...data.keywords],
    alternates: {
      languages: { de: "/de/kinder-hno-wien-1100", tr: "/tr/cocuk-kbb-wien-1100" },
    },
  };
}

export default async function KinderHnoLanding({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "de" | "tr";

  return (
    <>
      <SeoLandingTemplate
        data={seoLandings.kinderHno}
        lang={lang}
        locale={locale}
        serviceLink={`/${locale}/leistungen/kinder-hno`}
      />
      <GoogleBusinessCTA />
    </>
  );
}
