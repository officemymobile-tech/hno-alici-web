import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export default async function PatientInfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("patientInfo");
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {t("insurance.title")}
          </h2>
          <p className="mt-4 text-text-muted">{t("insurance.text")}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-petrol">
            {t("acute.title")}
          </h2>
          <p className="mt-4 text-text-muted">{t("acute.text")}</p>
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
            {t("downloads.title")}
          </h2>
          <p className="mt-4 text-text-muted">{t("downloads.text")}</p>
        </section>
      </div>
    </>
  );
}
