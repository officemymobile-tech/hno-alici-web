"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertCircle, AlertTriangle, ChevronDown, Info, Megaphone } from "lucide-react";
import type { AnnouncementData, AnnouncementVariant } from "@/lib/announcements";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const variantStyles: Record<
  AnnouncementVariant,
  { panel: string; icon: typeof Info; badge: string }
> = {
  info: {
    panel: "border-petrol/20 bg-accent-soft/50",
    icon: Info,
    badge: "bg-petrol",
  },
  warning: {
    panel: "border-gold/40 bg-gold/10",
    icon: AlertTriangle,
    badge: "bg-gold",
  },
  urgent: {
    panel: "border-petrol-dark bg-petrol text-white",
    icon: AlertCircle,
    badge: "bg-rose-500",
  },
};

type Props = {
  locale: Locale;
  announcement: AnnouncementData | null;
  className?: string;
  onNavigate?: () => void;
};

export function AktuellesNavMenu({ locale, announcement, className, onNavigate }: Props) {
  const t = useTranslations("nav.aktuellesMenu");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasNews = Boolean(announcement);
  const variant = announcement?.variant ?? "info";
  const { panel, icon: Icon, badge } = variantStyles[variant];
  const isUrgent = variant === "urgent";

  const title = announcement?.title[locale]?.trim();
  const text = announcement?.text[locale]?.trim();
  const linkUrl = announcement?.link.url?.trim();
  const linkLabel = announcement?.link.label[locale]?.trim();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium transition hover:text-petrol",
          open || hasNews ? "text-petrol" : "text-text-muted",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="relative inline-flex items-center gap-1.5">
          <Megaphone size={15} strokeWidth={1.75} className="opacity-80" aria-hidden />
          {t("label")}
          {hasNews ? (
            <span
              className={cn("absolute -right-2 -top-1 h-2 w-2 rounded-full", badge, hasNews && "animate-pulse")}
              aria-hidden
            />
          ) : null}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn("transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-cream-dark bg-white p-1 shadow-2xl shadow-petrol/10 lg:left-1/2 lg:right-auto lg:-translate-x-1/2">
          {hasNews ? (
            <div className={cn("rounded-xl border p-5", panel)}>
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isUrgent ? "bg-white/15 text-white" : "bg-white text-petrol shadow-sm",
                  )}
                >
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em]",
                      isUrgent ? "text-gold-light" : "text-gold",
                    )}
                  >
                    {t("eyebrow")}
                  </p>
                  {title ? (
                    <p
                      className={cn(
                        "mt-2 font-display text-xl font-semibold leading-snug",
                        isUrgent ? "text-white" : "text-petrol",
                      )}
                    >
                      {title}
                    </p>
                  ) : null}
                  {text ? (
                    <p
                      className={cn(
                        "mt-2 text-sm leading-relaxed",
                        isUrgent ? "text-white/90" : "text-text",
                        title ? "" : "mt-2",
                      )}
                    >
                      {text}
                    </p>
                  ) : null}
                  {linkUrl && linkLabel ? (
                    <Link
                      href={linkUrl}
                      className={cn(
                        "mt-4 inline-flex items-center text-sm font-semibold underline underline-offset-2 transition hover:opacity-80",
                        isUrgent ? "text-gold-light" : "text-petrol",
                      )}
                      onClick={close}
                      {...(linkUrl.startsWith("http") ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                    >
                      {linkLabel} →
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-cream/60 px-5 py-6 text-center">
              <Megaphone className="mx-auto h-8 w-8 text-text-muted/40" strokeWidth={1.25} aria-hidden />
              <p className="mt-3 text-sm font-medium text-text">{t("emptyTitle")}</p>
              <p className="mt-1 text-xs text-text-muted">{t("emptyText")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AktuellesMobilePanel({
  locale,
  announcement,
  onNavigate,
}: Omit<Props, "className">) {
  const t = useTranslations("nav.aktuellesMenu");
  const hasNews = Boolean(announcement);

  if (!hasNews) {
    return (
      <div className="rounded-xl border border-cream-dark bg-cream/50 px-4 py-3">
        <p className="text-sm font-medium text-text-muted">{t("emptyTitle")}</p>
      </div>
    );
  }

  const variant = announcement!.variant;
  const { panel, icon: Icon } = variantStyles[variant];
  const isUrgent = variant === "urgent";
  const title = announcement!.title[locale]?.trim();
  const text = announcement!.text[locale]?.trim();
  const linkUrl = announcement!.link.url?.trim();
  const linkLabel = announcement!.link.label[locale]?.trim();

  return (
    <div className={cn("rounded-xl border p-4", panel)}>
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          className={cn("mt-0.5 shrink-0", isUrgent ? "text-gold-light" : "text-petrol")}
          aria-hidden
        />
        <div className="min-w-0">
          {title ? (
            <p className={cn("font-semibold", isUrgent ? "text-white" : "text-petrol")}>{title}</p>
          ) : null}
          {text ? (
            <p className={cn("text-sm leading-relaxed", isUrgent ? "text-white/90" : "text-text", title && "mt-1")}>
              {text}
            </p>
          ) : null}
          {linkUrl && linkLabel ? (
            <Link
              href={linkUrl}
              className={cn(
                "mt-2 inline-block text-sm font-semibold underline underline-offset-2",
                isUrgent ? "text-gold-light" : "text-petrol",
              )}
              onClick={onNavigate}
              {...(linkUrl.startsWith("http") ? { rel: "noopener noreferrer", target: "_blank" } : {})}
            >
              {linkLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
