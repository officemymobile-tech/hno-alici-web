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
    // `metaTitle` is authored as the complete, final title (some CMS
    // entries already end in "| <brand>", some don't, by the content
    // editor's own choice per page) — `absolute` opts out of the parent
    // layout's `%s | {siteName}` template, which otherwise double-brands
    // any metaTitle that already includes it. Confirmed broken the first
    // time this ran against real restored Sanity content, 2026-11-24;
    // the project's own pre-existing seo.spec.ts test exists specifically
    // to catch this failure mode.
    title: { absolute: content.metaTitle[lang] },
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
