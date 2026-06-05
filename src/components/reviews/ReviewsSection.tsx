import { getLocale, getTranslations } from "next-intl/server";
import { patientReviews, reviewPlatforms } from "@/content/reviews";
import { Button } from "@/components/ui/Button";
import { ReviewCard } from "./ReviewCard";
import { PlatformRatingCard } from "./PlatformRatingCard";

export async function ReviewsSection({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("reviews");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";
  const displayed = compact ? patientReviews.slice(0, 3) : patientReviews;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
            {lang === "tr" ? "Hasta yorumları" : "Patientenstimmen"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-petrol">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <PlatformRatingCard
            name="Google"
            rating={reviewPlatforms.google.rating}
            reviewCount={reviewPlatforms.google.reviewCount}
            url={reviewPlatforms.google.url}
            lang={lang}
            highlight
          />
          <PlatformRatingCard
            name="DocFinder"
            rating={reviewPlatforms.docfinder.rating}
            reviewCount={reviewPlatforms.docfinder.reviewCount}
            url={reviewPlatforms.docfinder.url}
            lang={lang}
          />
          <PlatformRatingCard
            name="Herold"
            rating={reviewPlatforms.herold.rating}
            reviewCount={reviewPlatforms.herold.reviewCount}
            url={reviewPlatforms.herold.url}
            lang={lang}
          />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((review) => (
            <ReviewCard key={review.id} review={review} lang={lang} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button href={`/${locale}/bewertungen`} variant="secondary" size="lg">
            {lang === "tr" ? "Tüm yorumlar" : "Alle Bewertungen"}
          </Button>
          <Button
            href={reviewPlatforms.google.url}
            variant="primary"
            size="lg"
            external
          >
            {t("writeReview")}
          </Button>
        </div>
      </div>
    </section>
  );
}
