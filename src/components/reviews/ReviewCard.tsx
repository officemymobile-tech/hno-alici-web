import { StarRating } from "./StarRating";
import type { ReviewItem } from "@/content/reviews";

type ReviewCardProps = {
  review: ReviewItem;
  lang: "de" | "tr";
};

const sourceLabels = {
  google: "Google",
  docfinder: "DocFinder",
  herold: "Herold",
};

export function ReviewCard({ review, lang }: ReviewCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-cream-dark transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-petrol/10">
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={review.rating} size="sm" />
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-petrol">
          {sourceLabels[review.source]}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold text-petrol">
        {review.title[lang]}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
        „{review.text[lang]}"
      </p>
      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-text-muted/70">
        — {review.author}
      </p>
    </article>
  );
}
