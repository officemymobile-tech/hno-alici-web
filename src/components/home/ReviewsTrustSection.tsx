import { getTranslations, getLocale } from "next-intl/server";
import { ServiceIcon, type IconKey } from "@/components/icons/ServiceIcon";
import { StarRating } from "@/components/reviews/StarRating";
import { Button } from "@/components/ui/Button";
import { patientReviews, reviewPlatforms } from "@/content/reviews";
import { getEditableText } from "@/lib/editable-content";

const trustIcons: Record<string, IconKey> = {
  experience: "stethoscope",
  children: "children",
  turkish: "languages",
  insurance: "badge-check",
};

// Homepage-only: the reference's 2-column "reviews + why patients choose us"
// section — not the full /bewertungen page layout (ReviewsSection's
// non-compact path, untouched, still shows all 3 platform cards + the full
// review grid there). Real data only: the same reviewPlatforms/patientReviews
// content every other review surface on the site uses, no new numbers.
export async function ReviewsTrustSection() {
  const t = await getTranslations("reviews");
  const tTrust = await getTranslations("trust");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";
  const featured = patientReviews.find((r) => r.rating === 5) ?? patientReviews[0];
  const trustItems = ["experience", "children", "turkish", "insurance"] as const;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-ink">
            {lang === "tr" ? "Hasta yorumları" : "Patientenstimmen"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-petrol sm:text-4xl lg:text-5xl">
            {getEditableText("reviews", "title", lang, t("title"))}
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            {getEditableText("reviews", "subtitle", lang, t("subtitle"))}
          </p>

          <a
            href={reviewPlatforms.google.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-5 rounded-3xl bg-petrol p-7 text-white shadow-xl shadow-petrol/20 ring-2 ring-gold/40 transition hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 shrink-0" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-light">Google</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold">{reviewPlatforms.google.rating.toFixed(1)}</span>
                <StarRating rating={reviewPlatforms.google.rating} size="sm" tone="dark" />
              </div>
              <p className="mt-1 text-sm text-white/70">
                {reviewPlatforms.google.reviewCount}+ {lang === "tr" ? "yorum" : "Bewertungen"}
              </p>
            </div>
          </a>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
            <span>
              DocFinder <strong className="text-petrol">{reviewPlatforms.docfinder.rating}</strong> ({reviewPlatforms.docfinder.reviewCount})
            </span>
            <span aria-hidden>·</span>
            <span>
              Herold <strong className="text-petrol">{reviewPlatforms.herold.rating}</strong> ({reviewPlatforms.herold.reviewCount})
            </span>
          </div>

          <figure className="mt-8 rounded-3xl bg-cream p-7 ring-1 ring-cream-dark">
            <StarRating rating={featured.rating} size="sm" />
            <blockquote className="mt-4 text-lg leading-relaxed text-text">
              „{featured.text[lang]}“
            </blockquote>
            <figcaption className="mt-4 text-sm font-medium uppercase tracking-wider text-text-muted">
              — {featured.author}
            </figcaption>
          </figure>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={`/${locale}/bewertungen`} variant="secondary" size="md">
              {lang === "tr" ? "Tüm yorumlar" : "Alle Bewertungen"}
            </Button>
            <Button href={reviewPlatforms.google.writeReviewUrl} variant="primary" size="md" external>
              {t("writeReview")}
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-3xl font-semibold leading-tight text-petrol sm:text-4xl lg:text-5xl">
            {getEditableText("trust", "title", lang, tTrust("title"))}
          </h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {trustItems.map((key) => (
              <div key={key} className="flex flex-col items-start">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-petrol">
                  <ServiceIcon name={trustIcons[key]} size={26} />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-petrol">
                  {tTrust(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-text-muted">
                  {tTrust(`items.${key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
