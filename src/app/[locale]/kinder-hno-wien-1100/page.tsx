import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { seoLandings } from "@/content/seo-landings";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const data = seoLandings.kinderHno;
  const deUrl = `${siteConfig.domain}/de/kinder-hno-wien-1100`;
  const trUrl = `${siteConfig.domain}/tr/cocuk-kbb-wien-1100`;
  return {
    title: data.title[lang],
    description: data.metaDescription[lang],
    keywords: [...data.keywords],
    // Same pattern as tuerkischer-hno-arzt-wien: under /tr/ this renders the same
    // Turkish content as /tr/cocuk-kbb-wien-1100, so canonicalize there instead.
    alternates:
      lang === "de"
        ? { canonical: deUrl, languages: { "de-AT": deUrl, "tr-AT": trUrl } }
        : { canonical: trUrl },
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
