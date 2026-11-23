import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { generalFaq } from "@/content/general-faq";

export async function FaqSection() {
  const t = await getTranslations("patientInfo");
  const tHome = await getTranslations("home.faq");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";
  const faqItems = generalFaq.map((item) => ({ q: item.q[lang], a: item.a[lang] }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="bg-white py-16 lg:py-20" aria-labelledby="home-faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto grid min-w-0 max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-ink">
            {tHome("eyebrow")}
          </p>
          <h2 id="home-faq-title" className="mt-3 font-display text-3xl font-semibold leading-tight text-petrol sm:text-4xl lg:text-5xl">
            {t("faq.title")}
          </h2>
          <p className="mt-4 text-lg text-text-muted">{tHome("subtitle")}</p>
          <Link
            href={`/${locale}/patienteninfo`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-petrol hover:text-petrol-light"
          >
            {tHome("moreLink")} →
          </Link>
        </div>

        <FaqAccordion
          items={faqItems.map((item, index) => ({
            id: String(index),
            question: item.q,
            answer: item.a,
          }))}
        />
      </div>
    </section>
  );
}
