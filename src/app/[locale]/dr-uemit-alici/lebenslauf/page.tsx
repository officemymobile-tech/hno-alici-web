import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { doctorProfile } from "@/content/doctor-profile";

type Props = { params: Promise<{ locale: string }> };

export default async function CvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader title={lang === "tr" ? "Özgeçmiş" : "Lebenslauf"} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-4">
          {doctorProfile.cv[lang].map((item) => (
            <li key={item} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-cream-dark">
              <span className="text-gold">●</span>
              <span className="text-text-muted">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
