import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

  return (
    <div className={cn("flex items-center gap-0.5 text-gold", sizes[size], className)} aria-label={`${rating} von ${max} Sternen`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}
