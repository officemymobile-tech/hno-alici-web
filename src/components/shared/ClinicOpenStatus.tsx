"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getActiveClosureReason,
  getNextOpening,
  getTodayHoursLabel,
  isClinicOpen,
  type ResolvedSchedule,
} from "@/lib/opening-hours";
import { cn } from "@/lib/utils";

type Variant = "compact" | "bar" | "card" | "strip";
type Surface = "dark" | "light";

type Props = {
  variant?: Variant;
  surface?: Surface;
  className?: string;
  /** Plain serializable schedule data resolved at build time by a Server
   * Component ancestor (src/lib/opening-hours-source.ts) — never a Sanity
   * client or token; this component only ever receives already-resolved
   * strings/numbers as a prop. */
  schedule: ResolvedSchedule;
};

function useClinicStatus(schedule: ResolvedSchedule) {
  // Initial state is still computed from "now" synchronously (no flash of a
  // wrong placeholder on mount), but this is a static-export site: the
  // server-rendered HTML is baked at build time, while hydration happens
  // whenever a browser later loads the page — potentially minutes or hours
  // apart. If "now" crosses a schedule boundary in between, the server and
  // client can legitimately disagree on the open/closed text, which React
  // reports as a hydration mismatch (error #418, confirmed reproducing in
  // Playwright). The client's own, more current computation is always the
  // one that should win here, so the mismatch is intentional, not a bug to
  // resolve by matching the server — `suppressHydrationWarning` on the
  // specific text nodes below is the standard React pattern for exactly
  // this (client-truth, SSR-approximation) content category.
  const [open, setOpen] = useState(() => isClinicOpen(schedule));
  const [todayHours, setTodayHours] = useState(() => getTodayHoursLabel(schedule));
  const [nextOpening, setNextOpening] = useState(() => getNextOpening(schedule));
  const [closureReason, setClosureReason] = useState(() => getActiveClosureReason(schedule));
  // Starts false on every render (server and client alike) and flips to true
  // inside useEffect, which never runs during SSR — so the very first client
  // render is guaranteed to match the server's "checking" placeholder
  // exactly, structure and text included, before the real (possibly
  // differently-timed) status takes over a tick later.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      setOpen(isClinicOpen(schedule, now));
      setTodayHours(getTodayHoursLabel(schedule, now));
      setNextOpening(getNextOpening(schedule, now));
      setClosureReason(getActiveClosureReason(schedule, now));
    };

    refresh();
    setMounted(true);
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- schedule is build-time-resolved, static for the component's lifetime
  }, []);

  return { open, todayHours, nextOpening, closureReason, mounted };
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

export function ClinicOpenStatus({ variant = "compact", surface = "dark", className, schedule }: Props) {
  const t = useTranslations("openStatus");
  const locale = useLocale() as "de" | "tr";
  const { open, todayHours, nextOpening, closureReason, mounted } = useClinicStatus(schedule);

  const nextLabel =
    nextOpening &&
    (nextOpening.isToday
      ? t("opensToday", { time: nextOpening.time })
      : t("opensOn", {
          day: t(`days.${nextOpening.dayKey}`),
          time: nextOpening.time,
        }));

  // Identical on server and on the client's first render (before useEffect
  // runs) — a neutral, honest "checking" state, never a guessed open/closed
  // claim that the real computation might immediately contradict. See
  // useClinicStatus's comment for why open/closed can't be trusted to match
  // between build time and hydration time on a static-export site.
  if (!mounted) {
    const neutralDot = "bg-slate-400";
    if (variant === "card") {
      return (
        <div className={cn("flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4", className)} role="status" aria-live="polite">
          <span className={cn("mt-1 h-3 w-3 shrink-0 rounded-full", neutralDot)} aria-hidden />
          <p className="font-semibold text-slate-600">{t("checking")}</p>
        </div>
      );
    }
    if (variant === "strip") {
      return (
        <div className={cn("min-w-0", className)} role="status" aria-live="polite">
          <p className="text-base font-semibold text-slate-500">{t("checking")}</p>
        </div>
      );
    }
    if (variant === "bar") {
      return (
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)} role="status" aria-live="polite">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70 ring-1 ring-white/20">
            <span className={cn("h-2 w-2 rounded-full", neutralDot)} aria-hidden />
            {t("checking")}
          </span>
        </div>
      );
    }
    const compactNeutral = surface === "dark" ? "bg-white/10 text-white/70 ring-white/20" : "bg-slate-100 text-slate-600 ring-slate-200";
    return (
      <span className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", compactNeutral, className)} role="status" aria-live="polite">
        <span className={cn("h-2 w-2 rounded-full", neutralDot)} aria-hidden />
        {t("checking")}
      </span>
    );
  }

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
          {!open && closureReason ? (
            <p className="mt-1 text-sm text-rose-700">{closureReason[locale]}</p>
          ) : !open && nextLabel ? (
            <p className="mt-1 text-sm text-rose-700">{nextLabel}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (variant === "strip") {
    return (
      <div className={cn("min-w-0", className)} role="status" aria-live="polite">
        <p className={cn("text-base font-semibold", open ? "text-emerald-700" : "text-rose-700")}>
          {open ? t("open") : t("closed")}
        </p>
        {open && todayHours ? (
          <p className="mt-1 truncate text-sm text-text-muted">{t("todayHours", { hours: todayHours })}</p>
        ) : !open && closureReason ? (
          <p className="mt-1 truncate text-sm text-text-muted">{closureReason[locale]}</p>
        ) : !open && nextLabel ? (
          <p className="mt-1 truncate text-sm text-text-muted">{nextLabel}</p>
        ) : null}
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
