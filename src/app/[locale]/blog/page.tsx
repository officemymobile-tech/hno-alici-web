import Link from "next/link";
import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { blogPosts } from "@/content/seo-landings";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "Blog | HNO Alici" : "Blog | HNO Alici Wien",
    description: locale === "tr" ? "KBB sağlık makaleleri" : "HNO-Ratgeber und Gesundheitstipps aus Wien Favoriten",
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle={lang === "tr" ? "KBB sağlık rehberi" : "HNO-Ratgeber Wien"}
      />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-cream-dark transition hover:shadow-lg">
            <time className="text-xs font-medium uppercase tracking-widest text-gold">
              {new Date(post.date).toLocaleDateString(lang === "tr" ? "tr-AT" : "de-AT")}
            </time>
            <h2 className="mt-3 font-display text-2xl font-semibold text-petrol">
              <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-petrol-light">
                {post.title[lang]}
              </Link>
            </h2>
            <p className="mt-3 text-text-muted">{post.excerpt[lang]}</p>
            <Link href={`/${locale}/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-petrol">
              {lang === "tr" ? "Devamını oku →" : "Weiterlesen →"}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
