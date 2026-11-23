import { getLocale } from "next-intl/server";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { reviewPlatforms } from "@/content/reviews";

export async function GoogleBusinessCTA() {
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <section className="bg-petrol-dark py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">Google</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            {lang === "tr" ? "Google'da bizi değerlendirin" : "Bewerten Sie uns auf Google"}
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2.5 sm:justify-start">
            <StarRating rating={reviewPlatforms.google.rating} size="md" />
            <span className="text-sm text-white/75">
              {reviewPlatforms.google.rating} · {reviewPlatforms.google.reviewCount}+ {lang === "tr" ? "yorum" : "Bewertungen"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-center gap-3">
          <Button href={reviewPlatforms.google.writeReviewUrl} variant="primary" size="md" external>
            {lang === "tr" ? "Google'da değerlendir" : "Auf Google bewerten"}
          </Button>
          <Button href={reviewPlatforms.google.url} variant="outline" size="md" external>
            Google Maps
          </Button>
        </div>
      </div>
    </section>
  );
}
