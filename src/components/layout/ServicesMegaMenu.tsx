"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, Phone } from "lucide-react";
import { ServiceIcon, serviceSlugToIcon } from "@/components/icons/ServiceIcon";
import { megaMenuCategories } from "@/content/mega-menu";
import { serviceSlugToKey } from "@/lib/site";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  isActive: boolean;
};

export function ServicesMegaMenu({ locale, isActive }: Props) {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-sm font-medium transition hover:text-petrol",
          isActive || open ? "text-petrol" : "text-text-muted",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        {t("services")}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn("transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-cream-dark bg-white p-6 shadow-2xl shadow-petrol/10">
          <div className="grid gap-6 md:grid-cols-3">
            {megaMenuCategories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/${locale}/leistungen/${category.overviewSlug}`}
                  className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-accent-soft"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-petrol group-hover:bg-white">
                    <ServiceIcon name={category.iconKey} size={20} />
                  </span>
                  <span>
                    <span className="block font-semibold text-petrol group-hover:text-petrol-light">
                      {tServices(`${serviceSlugToKey[category.overviewSlug]}.title`)}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-muted">
                      {t("servicesMenu.overview")}
                    </span>
                  </span>
                </Link>
                {category.services.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t border-cream-dark pt-3">
                    {category.services.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/${locale}/leistungen/${slug}`}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition hover:bg-cream hover:text-petrol"
                          onClick={() => setOpen(false)}
                        >
                          <ServiceIcon name={serviceSlugToIcon(slug)} size={16} className="opacity-60" />
                          {tServices(`${serviceSlugToKey[slug]}.title`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-cream-dark pt-5 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/leistungen`}
              className="text-sm font-semibold text-petrol hover:text-petrol-light"
              onClick={() => setOpen(false)}
            >
              {t("servicesMenu.allServices")} →
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-petrol-dark transition hover:bg-gold-light"
              onClick={() => setOpen(false)}
            >
              <Phone size={16} strokeWidth={2} className="fill-current" />
              {t("servicesMenu.acute")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
