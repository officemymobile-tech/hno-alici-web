"use client";

import { useTranslations } from "next-intl";
import { ClinicOpenStatus } from "@/components/shared/ClinicOpenStatus";
import { siteConfig } from "@/lib/site";

export function StickyBar() {
  const t = useTranslations("sticky");

  return (
    <div className="border-b border-white/10 bg-petrol-dark text-white text-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
          <ClinicOpenStatus variant="bar" />
          <p className="hidden min-w-0 truncate font-medium text-white/85 lg:block lg:max-w-md xl:max-w-lg">
            {t("acute")}
          </p>
        </div>
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
