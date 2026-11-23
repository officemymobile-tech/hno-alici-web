import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { GoogleMapEmbed, MapDirectionsPanel } from "@/components/maps/GoogleMapEmbed";
import { Button } from "@/components/ui/Button";
import { reviewPlatforms } from "@/content/reviews";
import { getPageSeo } from "@/lib/page-seo";
import { getEditableText } from "@/lib/editable-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const t = await getTranslations({ locale, namespace: "reviews" });
  const { title, description } = await getPageSeo("bewertungen", lang, {
    title: t("title"),
    description: t("subtitle"),
  });
  return { title, description };
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviews");
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader
        title={getEditableText("reviews", "title", lang, t("title"))}
        subtitle={getEditableText("reviews", "subtitle", lang, t("subtitle"))}
      />
      <ReviewsSection />

      <section className="bg-accent-soft/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-display text-2xl font-semibold text-petrol">
            {getEditableText("reviews", "cta", lang, t("cta"))}
          </p>
          <Button
            href={reviewPlatforms.google.writeReviewUrl}
            variant="primary"
            size="lg"
            external
            className="mt-8"
          >
            {getEditableText("reviews", "writeReview", lang, t("writeReview"))}
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-petrol">
          {lang === "tr" ? "Konum & Google Maps" : "Standort & Google Maps"}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <GoogleMapEmbed className="aspect-[4/3] min-h-[360px]" />
          <MapDirectionsPanel lang={lang} />
        </div>
      </section>
    </>
  );
}
