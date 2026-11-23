import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** "dark" (default) for dark backgrounds (petrol / petrol-dark) — uses
   * --color-gold-light, which passes WCAG AA on both (5.10:1 / 7.04:1,
   * computed). "light" for white/cream/accent-soft backgrounds, where
   * plain --color-gold measured only 2.4:1 — uses the AA-compliant
   * --color-gold-ink instead (4.98:1). See globals.css. */
  tone?: "dark" | "light";
};

export function StarRating({ rating, max = 5, size = "md", className, tone = "dark" }: StarRatingProps) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

  return (
    <div
      role="img"
      className={cn("flex items-center gap-0.5", tone === "light" ? "text-gold-ink" : "text-gold-light", sizes[size], className)}
      aria-label={`${rating} von ${max} Sternen`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}
