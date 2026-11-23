import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { getPageSeo } from "@/lib/page-seo";
import { generalFaq } from "@/content/general-faq";
import { getEditableText } from "@/lib/editable-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const lang = locale as "de" | "tr";
  const { title, description } = await getPageSeo("patienteninfo", lang, {
    title: isTr ? "Hasta Bilgisi" : "Patienteninfo",
    description: isTr
      ? "Randevu, muayene süreci ve sık sorulan sorular — Wien Favoriten KBB muayenehanemiz hakkında hasta bilgileri."
      : "Terminvereinbarung, Ablauf des Besuchs und häufig gestellte Fragen rund um unsere HNO-Ordination in Wien Favoriten.",
  });
  return { title, description };
}

export default async function PatientInfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("patientInfo");
  const lang = locale as "de" | "tr";
  const faqItems = generalFaq.map((item) => ({ q: item.q[lang], a: item.a[lang] }));

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {getEditableText("patientInfo", "insuranceTitle", lang, t("insurance.title"))}
          </h2>
          <p className="mt-4 text-text-muted">{getEditableText("patientInfo", "insuranceText", lang, t("insurance.text"))}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {getEditableText("patientInfo", "acuteTitle", lang, t("acute.title"))}
          </h2>
          <p className="mt-4 text-text-muted">{getEditableText("patientInfo", "acuteText", lang, t("acute.text"))}</p>
          <Button href={`tel:${siteConfig.phone}`} variant="secondary" className="mt-6" external>
            {locale === "tr" ? "Acil randevu" : "Akuttermin anfragen"}
          </Button>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {t("faq.title")}
          </h2>
          <FaqAccordion
            className="mt-6"
            items={faqItems.map((item, index) => ({
              id: String(index),
              question: item.q,
              answer: item.a,
            }))}
          />
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {getEditableText("patientInfo", "downloadsTitle", lang, t("downloads.title"))}
          </h2>
          <p className="mt-4 text-text-muted">{getEditableText("patientInfo", "downloadsText", lang, t("downloads.text"))}</p>
        </section>
      </div>
    </>
  );
}
