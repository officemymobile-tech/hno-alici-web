import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/content/seo-landings";
import { siteConfig, serviceSlugToKey, type ServiceSlug } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return blogPosts.flatMap((p) => ["de", "tr"].map((locale) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const lang = locale as "de" | "tr";
  return { title: post.title[lang], description: post.excerpt[lang], keywords: [...post.keywords] };
}

// Phase 8 internal-linking pass: each blog post now links to the one real
// Leistungen page its own topic is actually about — not a generic "related
// posts" widget, a specific, factually-matched single link per post.
const relatedService: Record<string, string> = {
  "ohrenschmerzen-kind-wien": "kinder-hno",
  "allergietest-wien": "allergologie",
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const serviceSlug = relatedService[slug];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href={`/${locale}/blog`} className="text-sm font-semibold text-petrol">
        ← Blog
      </Link>
      <time className="mt-6 block text-sm text-gold-ink">
        {new Date(post.date).toLocaleDateString(lang === "tr" ? "tr-AT" : "de-AT")}
      </time>
      <h1 className="mt-3 font-display text-4xl font-semibold text-petrol">{post.title[lang]}</h1>
      <p className="mt-8 text-lg leading-relaxed text-text-muted">{post.content[lang]}</p>

      {serviceSlug && <RelatedServiceLink slug={serviceSlug as ServiceSlug} locale={locale} lang={lang} />}

      <div className="mt-12 flex flex-wrap gap-4">
        <Button href={`tel:${siteConfig.phone}`} variant="primary" external>
          {lang === "tr" ? "Randevu için ara" : "Termin anfragen"}
        </Button>
        <Button href={`/${locale}/termin`} variant="secondary">
          {lang === "tr" ? "Online form" : "Online Anfrage"}
        </Button>
      </div>
    </article>
  );
}

async function RelatedServiceLink({ slug, locale, lang }: { slug: ServiceSlug; locale: string; lang: "de" | "tr" }) {
  const t = await getTranslations("services");
  return (
    <Link
      href={`/${locale}/leistungen/${slug}`}
      className="mt-8 flex items-center gap-2 rounded-xl bg-accent-soft px-5 py-4 text-sm font-semibold text-petrol transition hover:bg-petrol hover:text-white"
    >
      {lang === "tr" ? "İlgili hizmet:" : "Passende Leistung:"} {t(`${serviceSlugToKey[slug]}.title`)}
      <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
    </Link>
  );
}
