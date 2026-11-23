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
  const lang = locale as "de" | "tr";
  const data = seoLandings.turkishHno;
  const deUrl = `${siteConfig.domain}/de/tuerkischer-hno-arzt-wien`;
  const trUrl = `${siteConfig.domain}/tr/turk-kbb-doktoru-wien`;
  return {
    title: data.title[lang],
    description: data.metaDescription[lang],
    keywords: [...data.keywords],
    // This route renders content in `lang`, which equals `locale` here — so under
    // /de/ it is the real German page (canonical = itself, reciprocal hreflang),
    // but under /tr/ it renders the same Turkish content as /tr/turk-kbb-doktoru-wien,
    // so it must canonicalize there instead of claiming to be its own page.
    alternates:
      lang === "de"
        ? { canonical: deUrl, languages: { "de-AT": deUrl, "tr-AT": trUrl } }
        : { canonical: trUrl },
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
