import Link from "next/link";
import { StarRating } from "./StarRating";

type PlatformRatingCardProps = {
  name: string;
  rating: number;
  reviewCount: number;
  url: string;
  lang: "de" | "tr";
  highlight?: boolean;
};

export function PlatformRatingCard({
  name,
  rating,
  reviewCount,
  url,
  lang,
  highlight,
}: PlatformRatingCardProps) {
  const reviewsLabel =
    lang === "tr"
      ? `${reviewCount} değerlendirme`
      : `${reviewCount} Bewertungen`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center rounded-2xl p-8 text-center transition duration-300 hover:-translate-y-1 ${
        highlight
          ? "bg-petrol text-white shadow-xl shadow-petrol/25 ring-2 ring-gold/40"
          : "bg-white shadow-sm ring-1 ring-cream-dark hover:shadow-lg hover:ring-petrol/15"
      }`}
    >
      {name === "Google" && (
        <svg viewBox="0 0 24 24" className="mb-3 h-8 w-8" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )}
      <p className={`text-sm font-semibold uppercase tracking-widest ${highlight ? "text-gold" : "text-gold"}`}>
        {name}
      </p>
      <p className={`mt-2 font-display text-4xl font-semibold ${highlight ? "text-white" : "text-petrol"}`}>
        {rating.toFixed(1)}
      </p>
      <StarRating rating={rating} className="mt-2 justify-center" />
      <p className={`mt-3 text-sm ${highlight ? "text-white/70" : "text-text-muted"}`}>
        {reviewsLabel}
      </p>
      <span className={`mt-4 text-xs font-semibold uppercase tracking-wider ${highlight ? "text-gold group-hover:text-gold-light" : "text-petrol group-hover:text-petrol-light"}`}>
        {lang === "tr" ? "Görüntüle →" : "Ansehen →"}
      </span>
    </Link>
  );
}
