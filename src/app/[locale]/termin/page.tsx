import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { getPageSeo } from "@/lib/page-seo";
import { getEditableText } from "@/lib/editable-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const t = await getTranslations({ locale, namespace: "appointment" });
  const { title, description } = await getPageSeo("termin", lang, {
    title: t("title"),
    description: t("subtitle"),
  });
  return { title, description };
}

export default async function AppointmentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "de" | "tr";
  const t = await getTranslations("appointment");

  return (
    <>
      <PageHeader
        title={getEditableText("appointment", "title", lang, t("title"))}
        subtitle={getEditableText("appointment", "subtitle", lang, t("subtitle"))}
      />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <AppointmentForm />
      </div>
    </>
  );
}
