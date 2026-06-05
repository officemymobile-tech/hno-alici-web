import { getLocale } from "next-intl/server";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { reviewPlatforms } from "@/content/reviews";

export async function GoogleBusinessCTA() {
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <section className="bg-petrol py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">Google</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">
          {lang === "tr" ? "Google'da bizi değerlendirin" : "Bewerten Sie uns auf Google"}
        </h2>
        <div className="mt-6 flex items-center justify-center gap-3">
          <StarRating rating={reviewPlatforms.google.rating} size="lg" />
          <span className="text-lg text-white/80">
            {reviewPlatforms.google.rating} · {reviewPlatforms.google.reviewCount}+ {lang === "tr" ? "yorum" : "Bewertungen"}
          </span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          {lang === "tr"
            ? "Deneyiminiz diğer hastalara yardımcı olur. Google Business profilimizde yorum bırakın."
            : "Ihre Erfahrung hilft anderen Patienten. Hinterlassen Sie eine Bewertung auf unserem Google-Profil."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={reviewPlatforms.google.writeReviewUrl} variant="primary" size="lg" external>
            {lang === "tr" ? "Google'da değerlendir" : "Auf Google bewerten"}
          </Button>
          <Button href={reviewPlatforms.google.url} variant="outline" size="lg" external>
            Google Maps
          </Button>
        </div>
      </div>
    </section>
  );
}
