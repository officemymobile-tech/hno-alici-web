import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { doctorProfile } from "@/content/doctor-profile";

type Props = { params: Promise<{ locale: string }> };

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
