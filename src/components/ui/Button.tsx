import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

const variants = {
  primary:
    "bg-gold text-petrol-dark hover:bg-gold-light shadow-lg shadow-gold/20",
  secondary:
    "bg-petrol text-white hover:bg-petrol-light shadow-lg shadow-petrol/20",
  outline:
    "border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm",
  ghost: "text-petrol hover:bg-petrol/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    variants[variant],
    sizes[size],
    className,
  );

  if (!href) {
    return <span className={classes}>{children}</span>;
  }

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
