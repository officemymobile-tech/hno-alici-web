import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/shared/FaqAccordion";

export async function FaqSection() {
  const t = await getTranslations("patientInfo");
  const tHome = await getTranslations("home.faq");
  const locale = await getLocale();
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

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
    <section className="bg-white py-24" aria-labelledby="home-faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          {tHome("eyebrow")}
        </p>
        <h2
          id="home-faq-title"
          className="mt-3 text-center font-display text-4xl font-semibold text-petrol"
        >
          {t("faq.title")}
        </h2>
        <p className="mt-4 text-center text-lg text-text-muted">{tHome("subtitle")}</p>

        <FaqAccordion
          className="mt-12"
          items={faqItems.map((item, index) => ({
            id: String(index),
            question: item.q,
            answer: item.a,
          }))}
        />

        <p className="mt-8 text-center">
          <Link
            href={`/${locale}/patienteninfo`}
            className="text-sm font-semibold uppercase tracking-widest text-petrol hover:text-petrol-light"
          >
            {tHome("moreLink")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
