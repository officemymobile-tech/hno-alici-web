import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { doctorProfile } from "@/content/doctor-profile";
import { getPageSeo } from "@/lib/page-seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const { title, description } = await getPageSeo("qualifikationen", locale as "de" | "tr", {
    title: isTr ? "Nitelikler" : "Qualifikationen",
    description: isTr
      ? `Dr. Ümit Alici'nin uzmanlık alanları: ${doctorProfile.qualifications.tr.slice(0, 3).join(", ")}.`
      : `Fachliche Qualifikationen von Dr. Ümit Alici: ${doctorProfile.qualifications.de.slice(0, 3).join(", ")}.`,
  });
  return { title, description };
}

export default async function QualificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader title={lang === "tr" ? "Nitelikler" : "Qualifikationen"} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="grid gap-4 sm:grid-cols-2">
          {doctorProfile.qualifications[lang].map((item) => (
            <li key={item} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cream-dark">
              <span className="font-medium text-petrol">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
