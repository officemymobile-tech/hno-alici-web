import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { seoLandings } from "@/content/seo-landings";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = seoLandings.turkishHno;
  const deUrl = `${siteConfig.domain}/de/tuerkischer-hno-arzt-wien`;
  const trUrl = `${siteConfig.domain}/tr/turk-kbb-doktoru-wien`;
  return {
    // Bare title — the locale layout's title.template adds the site-name suffix
    // exactly once; it was previously hardcoded here too, duplicating it.
    title: data.title.tr,
    description: data.metaDescription.tr,
    keywords: [...data.keywords],
    // This route always renders Turkish content (component below is hardcoded
    // lang="tr") regardless of the locale prefix, so /tr/ is the one real page;
    // /de/ is the same content under a German URL and must canonicalize to /tr/.
    alternates:
      locale === "tr"
        ? { canonical: trUrl, languages: { "de-AT": deUrl, "tr-AT": trUrl } }
        : { canonical: trUrl },
  };
}

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
