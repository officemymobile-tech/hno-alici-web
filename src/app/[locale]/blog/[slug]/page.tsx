import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/content/seo-landings";
import { siteConfig } from "@/lib/site";

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

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href={`/${locale}/blog`} className="text-sm font-semibold text-petrol">
        ← Blog
      </Link>
      <time className="mt-6 block text-sm text-gold">
        {new Date(post.date).toLocaleDateString(lang === "tr" ? "tr-AT" : "de-AT")}
      </time>
      <h1 className="mt-3 font-display text-4xl font-semibold text-petrol">{post.title[lang]}</h1>
      <p className="mt-8 text-lg leading-relaxed text-text-muted">{post.content[lang]}</p>
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
