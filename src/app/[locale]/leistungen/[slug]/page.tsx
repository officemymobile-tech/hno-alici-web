import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ServiceLanding } from "@/components/services/ServiceLanding";
import { seoServices } from "@/content/seo-services";
import { serviceSlugs, type ServiceSlug } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return serviceSlugs.flatMap((slug) => ["de", "tr"].map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!serviceSlugs.includes(slug as ServiceSlug)) return {};
  const content = seoServices[slug as ServiceSlug];
  const lang = locale as "de" | "tr";
  return {
    title: content.metaTitle[lang],
    description: content.metaDescription[lang],
    keywords: content.keywords[lang],
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!serviceSlugs.includes(slug as ServiceSlug)) notFound();

  const content = seoServices[slug as ServiceSlug];
  const lang = locale as "de" | "tr";

  return <ServiceLanding content={content} lang={lang} locale={locale} />;
}
