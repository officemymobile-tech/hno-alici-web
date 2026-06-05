import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";

type Props = { params: Promise<{ locale: string }> };

export default async function AppointmentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appointment");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <AppointmentForm />
      </div>
    </>
  );
}
