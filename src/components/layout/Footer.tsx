import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { images } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");
  const locale = await getLocale();

  return (
    <footer className="gradient-hero text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src={images.logoDrUmit}
              alt="Dr. Ümit Alici"
              width={200}
              height={71}
              className="mb-4 brightness-0 invert"
            />
            <p className="max-w-md text-white/75">{t("tagline")}</p>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">
              {tNav("contact")}
            </p>
            <ul className="space-y-2 text-white/80">
              <li>{tContact("address")}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                  {tContact("phone")}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {tContact("email")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold">
              Links
            </p>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href={`/${locale}`} className="hover:text-white">
                  {tNav("ordination")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/team`} className="hover:text-white">
                  {tNav("team")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/leistungen`} className="hover:text-white">
                  {tNav("services")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/bewertungen`} className="hover:text-white">
                  {tNav("reviews")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/kontakt`} className="hover:text-white">
                  {tNav("contact")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <a href={siteConfig.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Google Maps
                </a>
              </li>
              <li>
                <Link href={`/${locale}/impressum`} className="hover:text-white">
                  {t("imprint")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/datenschutz`} className="hover:text-white">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookie-richtlinie`} className="hover:text-white">
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/haftungsausschluss`} className="hover:text-white">
                  {t("disclaimer")}
                </Link>
              </li>
              <li>
                <CookieSettingsLink label={t("cookieSettings")} className="hover:text-white" />
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm text-white/80">
          {t("emergency")}{" "}
          <a href="tel:144" className="font-semibold text-gold hover:text-gold-light">
            144
          </a>
        </div>
        <div className="mt-6 border-t border-white/15 pt-8 text-sm text-white/60">
          © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
