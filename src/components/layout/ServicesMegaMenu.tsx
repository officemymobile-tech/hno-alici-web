"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { ServiceIcon, serviceSlugToIcon } from "@/components/icons/ServiceIcon";
import { megaMenuCategories } from "@/content/mega-menu";
import { seoServices } from "@/content/seo-services";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  isActive: boolean;
};

// Premium redesign (2026-11-22): the previous panel gave "Allgemeine HNO"
// a full sub-link list while "Kinder-HNO" and "Allergologie" — which have
// no further sub-pages in the real site structure (confirmed: neither
// megaMenuCategories entry nor serviceSlugs assigns any sub-item to them;
// not changed here, since inventing one would be a fabricated Leistung) —
// showed only a bare title, reading as broken empty space. Fixed by giving
// every category its own real 1-line description (the same
// services.<key>.text copy already used on the homepage's ServicesPreview)
// so all 3 columns carry real visual weight regardless of sub-link count,
// instead of inventing content to "fill" the empty ones.
export function ServicesMegaMenu({ locale, isActive }: Props) {
  const t = useTranslations("nav");
  const tAppointment = useTranslations("appointment");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // A short close delay on mouseleave — without it, moving the cursor
  // diagonally from the trigger down into the panel can cross a gap and
  // fire "leave" before "enter", snapping the menu shut mid-hover. Clearing
  // the timer on re-entry (trigger or panel) cancels a pending close.
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition hover:text-petrol",
          isActive || open ? "text-petrol" : "text-text-muted",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          // Deliberately not a toggle: a real mouse click fires `mouseenter`
          // (which already opens the panel via the container handler above)
          // *before* the click event itself — a toggle here would close the
          // panel again immediately after `mouseenter` just opened it. Click
          // always opens; closing is handled by Escape, an outside click, or
          // the mouseleave-with-delay above — this is also what lets
          // keyboard users (Enter/Space on a focused, unhovered button, so
          // no prior `mouseenter` fired) open it reliably.
          cancelClose();
          setOpen(true);
        }}
      >
        {t("services")}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn("transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          data-testid="mega-menu-panel"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-xl shadow-petrol/10"
        >
          <div className="grid divide-x divide-cream-dark sm:grid-cols-3">
            {megaMenuCategories.map((category) => (
              <div key={category.id} className="flex flex-col p-5">
                <Link
                  href={`/${locale}/leistungen/${category.overviewSlug}`}
                  className="group -m-1 rounded-xl p-1"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-petrol transition group-hover:bg-gold/15 group-hover:text-gold-ink">
                    <ServiceIcon name={category.iconKey} size={22} />
                  </span>
                  <span className="mt-3 block font-display text-base font-semibold text-petrol group-hover:text-petrol-light">
                    {seoServices[category.overviewSlug].shortTitle[locale as "de" | "tr"]}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                    {seoServices[category.overviewSlug].cardText[locale as "de" | "tr"]}
                  </span>
                </Link>

                {category.services.length > 0 && (
                  <ul className="mt-3 space-y-0.5 border-t border-cream-dark pt-3">
                    {category.services.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/${locale}/leistungen/${slug}`}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-text-muted transition hover:bg-cream hover:text-petrol"
                          onClick={() => setOpen(false)}
                        >
                          <ServiceIcon name={serviceSlugToIcon(slug)} size={15} className="shrink-0 opacity-60" />
                          <span className="truncate">{seoServices[slug].shortTitle[locale as "de" | "tr"]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-cream-dark bg-cream/60 px-5 py-4">
            <Link
              href={`/${locale}/leistungen`}
              className="text-sm font-semibold text-petrol transition hover:text-petrol-light"
              onClick={() => setOpen(false)}
            >
              {t("servicesMenu.allServices")} →
            </Link>
            <Link
              href={`/${locale}/termin`}
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-petrol-dark transition hover:bg-gold-light"
              onClick={() => setOpen(false)}
            >
              {tAppointment("title")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
