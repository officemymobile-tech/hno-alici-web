import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { doctorProfile } from "@/content/doctor-profile";
import { getPageSeo } from "@/lib/page-seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const text = isTr ? doctorProfile.philosophy.tr : doctorProfile.philosophy.de;
  const { title, description } = await getPageSeo("philosophie", locale as "de" | "tr", {
    title: isTr ? "Felsefe" : "Philosophie",
    description: text.length > 155 ? text.slice(0, 152) + "..." : text,
  });
  return { title, description };
}

export default async function PhilosophyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader title={lang === "tr" ? "Felsefe" : "Philosophie"} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <blockquote className="font-display text-3xl font-medium italic leading-relaxed text-petrol">
          „{doctorProfile.philosophy[lang]}"
        </blockquote>
      </div>
    </>
  );
}
