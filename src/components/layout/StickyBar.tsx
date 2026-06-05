"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

export function StickyBar() {
  const t = useTranslations("sticky");

  return (
    <div className="bg-petrol-dark text-white text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="truncate font-medium">{t("acute")}</p>
        <a
          href={`tel:${siteConfig.phone}`}
          className="shrink-0 rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-petrol-dark transition hover:bg-gold-light"
        >
          {t("phone")}
        </a>
      </div>
    </div>
  );
}
