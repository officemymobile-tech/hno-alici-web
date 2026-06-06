"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ServiceIcon, serviceSlugToIcon } from "@/components/icons/ServiceIcon";
import { AktuellesMobilePanel, AktuellesNavMenu } from "@/components/layout/AktuellesNavMenu";
import { ServicesMegaMenu } from "@/components/layout/ServicesMegaMenu";
import { ClinicOpenStatus } from "@/components/shared/ClinicOpenStatus";
import type { AnnouncementData } from "@/lib/announcements";
import type { Locale } from "@/i18n/routing";
import { megaMenuCategories } from "@/content/mega-menu";
import { images } from "@/content/site-content";
import { serviceSlugToKey } from "@/lib/site";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "ordination", href: "" },
  { key: "team", href: "/team" },
  { key: "reviews", href: "/bewertungen" },
  { key: "contact", href: "/kontakt" },
  { key: "about", href: "/dr-uemit-alici" },
] as const;

type HeaderProps = {
  announcement?: AnnouncementData | null;
};

export function Header({ announcement = null }: HeaderProps) {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const switchLocale = locale === "de" ? "tr" : "de";
  const localizedPath = pathname.replace(`/${locale}`, `/${switchLocale}`) || `/${switchLocale}`;

  const isActive = (href: string) => {
    if (!href) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.includes(href);
  };

  const servicesActive = pathname.includes("/leistungen");

  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-3">
          <Image
            src={images.logo}
            alt="HNO Alici Logo"
            width={48}
            height={52}
            className="h-12 w-auto"
            priority
          />
          <div className="hidden flex-col gap-1.5 sm:flex">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
              HNO · Wien 1100
            </span>
            <ClinicOpenStatus variant="compact" surface="light" />
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
          {navItems.slice(0, 1).map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "text-sm font-medium transition hover:text-petrol",
                isActive(item.href) ? "text-petrol" : "text-text-muted",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <ServicesMegaMenu locale={locale} isActive={servicesActive} />
          {navItems.slice(1, 3).map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "text-sm font-medium transition hover:text-petrol",
                isActive(item.href) ? "text-petrol" : "text-text-muted",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <AktuellesNavMenu locale={locale as Locale} announcement={announcement} />
          {navItems.slice(3).map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "text-sm font-medium transition hover:text-petrol",
                isActive(item.href) ? "text-petrol" : "text-text-muted",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={localizedPath}
            className="rounded-full border border-cream-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-petrol transition hover:border-petrol/30 hover:bg-accent-soft"
          >
            {switchLocale.toUpperCase()}
          </Link>
          <Button
            href={`tel:+4316025400`}
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            external
          >
            {t("appointment")}
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-dark lg:hidden"
            aria-expanded={open}
            aria-label="Menü"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="h-5 w-5 text-petrol" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5 text-petrol" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-cream-dark bg-white px-4 py-4 lg:hidden" aria-label="Mobile Navigation">
          <ul className="space-y-1">
            <li>
              <Link
                href={`/${locale}`}
                className="block py-2.5 text-base font-medium text-text"
                onClick={() => setOpen(false)}
              >
                {t("ordination")}
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between py-2.5 text-base font-medium text-text"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((prev) => !prev)}
              >
                {t("services")}
                <ChevronDown
                  size={18}
                  className={cn("text-petrol transition", mobileServicesOpen && "rotate-180")}
                />
              </button>
              {mobileServicesOpen && (
                <ul className="mb-2 space-y-1 border-l-2 border-accent-soft pl-4">
                  {megaMenuCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/${locale}/leistungen/${category.overviewSlug}`}
                        className="flex items-center gap-2 py-2 text-sm font-medium text-petrol"
                        onClick={() => setOpen(false)}
                      >
                        <ServiceIcon name={category.iconKey} size={18} />
                        {tServices(`${serviceSlugToKey[category.overviewSlug]}.title`)}
                      </Link>
                      {category.services.length > 0 && (
                        <ul className="pb-1">
                          {category.services.map((slug) => (
                            <li key={slug}>
                              <Link
                                href={`/${locale}/leistungen/${slug}`}
                                className="flex items-center gap-2 py-1.5 pl-6 text-sm text-text-muted"
                                onClick={() => setOpen(false)}
                              >
                                <ServiceIcon name={serviceSlugToIcon(slug)} size={16} className="opacity-70" />
                                {tServices(`${serviceSlugToKey[slug]}.title`)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/${locale}/leistungen`}
                      className="block py-2 text-sm font-semibold text-gold"
                      onClick={() => setOpen(false)}
                    >
                      {t("servicesMenu.allServices")} →
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {navItems.slice(1, 3).map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="block py-2.5 text-base font-medium text-text"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <p className="py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t("aktuelles")}
              </p>
              <AktuellesMobilePanel
                locale={locale as Locale}
                announcement={announcement}
                onNavigate={() => setOpen(false)}
              />
            </li>
            {navItems.slice(3).map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="block py-2.5 text-base font-medium text-text"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            href={`tel:+4316025400`}
            variant="secondary"
            size="md"
            className="mt-4 w-full"
            external
          >
            {t("appointment")}
          </Button>
        </nav>
      )}
    </header>
  );
}
