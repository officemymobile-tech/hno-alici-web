"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getNextOpening,
  getTodayHoursLabel,
  isClinicOpen,
} from "@/lib/opening-hours";
import { cn } from "@/lib/utils";

type Variant = "compact" | "bar" | "card";
type Surface = "dark" | "light";

type Props = {
  variant?: Variant;
  surface?: Surface;
  className?: string;
};

function useClinicStatus() {
  const [open, setOpen] = useState(() => isClinicOpen());
  const [todayHours, setTodayHours] = useState(() => getTodayHoursLabel());
  const [nextOpening, setNextOpening] = useState(() => getNextOpening());

  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      setOpen(isClinicOpen(now));
      setTodayHours(getTodayHoursLabel(now));
      setNextOpening(getNextOpening(now));
    };

    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return { open, todayHours, nextOpening };
}

const compactStyles: Record<Surface, { open: string; closed: string; dotOpen: string; dotClosed: string }> = {
  dark: {
    open: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/35",
    closed: "bg-rose-500/15 text-rose-100 ring-rose-400/30",
    dotOpen: "animate-pulse bg-emerald-400",
    dotClosed: "bg-rose-400",
  },
  light: {
    open: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    closed: "bg-rose-50 text-rose-800 ring-rose-200",
    dotOpen: "bg-emerald-500",
    dotClosed: "bg-rose-500",
  },
};

export function ClinicOpenStatus({ variant = "compact", surface = "dark", className }: Props) {
  const t = useTranslations("openStatus");
  const { open, todayHours, nextOpening } = useClinicStatus();

  const nextLabel =
    nextOpening &&
    (nextOpening.isToday
      ? t("opensToday", { time: nextOpening.time })
      : t("opensOn", {
          day: t(`days.${nextOpening.dayKey}`),
          time: nextOpening.time,
        }));

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-start gap-4 rounded-xl border p-4",
          open
            ? "border-emerald-200 bg-emerald-50/80"
            : "border-rose-200 bg-rose-50/60",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span
          className={cn(
            "mt-1 h-3 w-3 shrink-0 rounded-full",
            open ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" : "bg-rose-500",
          )}
          aria-hidden
        />
        <div className="min-w-0">
          <p className={cn("font-semibold", open ? "text-emerald-800" : "text-rose-800")}>
            {open ? t("open") : t("closed")}
          </p>
          {open && todayHours ? (
            <p className="mt-1 text-sm text-emerald-700">{t("todayHours", { hours: todayHours })}</p>
          ) : null}
          {!open && nextLabel ? (
            <p className="mt-1 text-sm text-rose-700">{nextLabel}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
        role="status"
        aria-live="polite"
      >
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            open
              ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/35"
              : "bg-rose-500/15 text-rose-100 ring-1 ring-rose-400/30",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              open ? "animate-pulse bg-emerald-400" : "bg-rose-400",
            )}
            aria-hidden
          />
          {open ? t("open") : t("closed")}
        </span>
        {open && todayHours ? (
          <span className="hidden text-xs text-white/75 sm:inline">{todayHours}</span>
        ) : null}
        {!open && nextLabel ? (
          <span className="hidden text-xs text-white/70 md:inline">{nextLabel}</span>
        ) : null}
      </div>
    );
  }

  const compact = compactStyles[surface];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        open ? compact.open : compact.closed,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          open ? compact.dotOpen : compact.dotClosed,
        )}
        aria-hidden
      />
      {open ? t("open") : t("closed")}
    </span>
  );
}
