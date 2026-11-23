import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { images } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { getEditableText } from "@/lib/editable-content";

// lucide-react ships no brand/logo icons in this version — Facebook keeps
// its exact original inline glyph (zero visual change for the one platform
// actually configured today); any other platform name falls back to a
// generic link icon rather than silently disappearing.
function SocialIcon({ platform }: { platform: string }) {
  if (platform.toLowerCase().includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M15 3h3v4h-3c-.83 0-1.5.67-1.5 1.5V11H18l-.5 4H13.5v6h-4v-6H7v-4h2.5V8.25C9.5 5.35 11.35 3 15 3z" />
      </svg>
    );
  }
  return <Link2 size={16} strokeWidth={2} aria-hidden />;
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");
  const locale = await getLocale();

  return (
    <footer className="gradient-hero text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-white/10">
          <div className="lg:col-span-2 lg:pr-10">
            <Image
              src={siteConfig.logo ?? images.logoDrUmit}
              alt={siteConfig.name}
              width={200}
              height={71}
              className="mb-4 brightness-0 invert"
            />
            <p className="max-w-md text-white/75">{getEditableText("footer", "tagline", locale as "de" | "tr", t("tagline"))}</p>
            <ul className="mt-6 space-y-2 text-white/80">
              <li>{tContact("address")}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="transition-colors hover:text-white">
                  {tContact("phone")}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                  {tContact("email")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-light">
              {getEditableText("footer", "quickLinksHeading", locale as "de" | "tr", locale === "tr" ? "Hızlı Erişim" : "Schnellzugriff")}
            </p>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href={`/${locale}`} className="transition-colors hover:text-white">
                  {tNav("ordination")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/leistungen`} className="transition-colors hover:text-white">
                  {tNav("services")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/team`} className="transition-colors hover:text-white">
                  {tNav("team")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dr-uemit-alici`} className="transition-colors hover:text-white">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/bewertungen`} className="transition-colors hover:text-white">
                  {tNav("reviews")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-light">
              {getEditableText("footer", "patientInfoHeading", locale as "de" | "tr", locale === "tr" ? "Hasta Bilgisi" : "Patienteninfo")}
            </p>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href={`/${locale}/termin`} className="transition-colors hover:text-white">
                  {tNav("appointment")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/patienteninfo`} className="transition-colors hover:text-white">
                  {getEditableText("footer", "faqLinkLabel", locale as "de" | "tr", locale === "tr" ? "Sık Sorulan Sorular" : "Häufige Fragen")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/kontakt`} className="transition-colors hover:text-white">
                  {tNav("contact")}
                </Link>
              </li>
              <li>
                <a href={siteConfig.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  Google Maps
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-light">
              {getEditableText("footer", "legalHeading", locale as "de" | "tr", locale === "tr" ? "Yasal" : "Rechtliches")}
            </p>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href={`/${locale}/impressum`} className="transition-colors hover:text-white">
                  {getEditableText("footer", "imprint", locale as "de" | "tr", t("imprint"))}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/datenschutz`} className="transition-colors hover:text-white">
                  {getEditableText("footer", "privacy", locale as "de" | "tr", t("privacy"))}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookie-richtlinie`} className="transition-colors hover:text-white">
                  {getEditableText("footer", "cookies", locale as "de" | "tr", t("cookies"))}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/haftungsausschluss`} className="transition-colors hover:text-white">
                  {getEditableText("footer", "disclaimer", locale as "de" | "tr", t("disclaimer"))}
                </Link>
              </li>
              <li>
                <CookieSettingsLink label={getEditableText("footer", "cookieSettings", locale as "de" | "tr", t("cookieSettings"))} className="transition-colors hover:text-white" />
              </li>
            </ul>
            <p className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-gold-light">
              {getEditableText("footer", "followHeading", locale as "de" | "tr", locale === "tr" ? "Bizi takip edin" : "Folgen Sie uns")}
            </p>
            <div className="flex gap-2">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm text-white/80 sm:text-left">
            {getEditableText("footer", "emergency", locale as "de" | "tr", t("emergency"))}{" "}
            <a href="tel:144" className="font-semibold text-gold-light transition-colors hover:text-white">
              144
            </a>
          </div>
          <p className="text-center text-sm text-white/60 sm:text-right">
            © {new Date().getFullYear()} {siteConfig.name}. {getEditableText("footer", "rights", locale as "de" | "tr", t("rights"))}
          </p>
        </div>
      </div>
    </footer>
  );
}
