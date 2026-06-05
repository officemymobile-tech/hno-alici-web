import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { doctorProfile } from "@/content/doctor-profile";

type Props = { params: Promise<{ locale: string }> };

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
