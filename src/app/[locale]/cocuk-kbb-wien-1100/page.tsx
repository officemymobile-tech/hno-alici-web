import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { seoLandings } from "@/content/seo-landings";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = seoLandings.kinderHno;
  const deUrl = `${siteConfig.domain}/de/kinder-hno-wien-1100`;
  const trUrl = `${siteConfig.domain}/tr/cocuk-kbb-wien-1100`;
  return {
    title: data.title.tr,
    description: data.metaDescription.tr,
    keywords: [...data.keywords],
    // Same pattern as turk-kbb-doktoru-wien: always renders Turkish content
    // (lang="tr" hardcoded below), so /de/ must canonicalize to /tr/.
    alternates:
      locale === "tr"
        ? { canonical: trUrl, languages: { "de-AT": deUrl, "tr-AT": trUrl } }
        : { canonical: trUrl },
  };
}

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
