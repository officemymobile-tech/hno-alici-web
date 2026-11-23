import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { StickyBar } from "@/components/layout/StickyBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { siteConfig } from "@/lib/site";
import { images } from "@/content/site-content";
import { medicalClinicSchema, physicianSchema } from "@/lib/schema";
import { resolvedSchedule } from "@/lib/opening-hours-source";
import "../globals.css";

// Replaces the previous Cormorant Garamond display serif (2026-11-22,
// approved typography change) — Plus Jakarta Sans for all headings now.
// "latin-ext" is required, not optional: German umlauts/ß and Turkish
// ı/İ/ş/ğ/ç render from "latin" alone via browser fallback in most cases,
// but latin-ext is the subset Google Fonts actually ships those glyphs in
// for this family (confirmed via next/font's own font-data.json), so
// omitting it risks silent tofu/fallback-font swaps on exactly the
// characters this bilingual site depends on.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    keywords: t("keywords"),
    alternates: {
      canonical: `${siteConfig.domain}/${locale}`,
      // Region-specific hreflang codes (de-AT/tr-AT), not the bare "de"/"tr"
      // used before, and deliberately not "tr-TR" — the Turkish-language
      // content targets Turkish-speaking residents of Austria, not Turkey,
      // consistent with the OG locale below (already "tr_AT", unchanged).
      // The underlying next-intl locale keys/URL segments stay "de"/"tr" —
      // only this SEO-facing language/region declaration changed.
      languages: {
        "de-AT": `${siteConfig.domain}/de`,
        "tr-AT": `${siteConfig.domain}/tr`,
        "x-default": `${siteConfig.domain}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_AT" : "de_AT",
      url: `${siteConfig.domain}/${locale}`,
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("defaultDescription"),
      images: [
        {
          url: siteConfig.defaultOgImage ?? images.ordinationHero,
          width: 1536,
          height: 1024,
          alt: "HNO Ordination Dr. Ümit Alici – Wien Favoriten",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("defaultDescription"),
      images: [siteConfig.defaultOgImage ?? images.ordinationHero],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const schemas = [physicianSchema(), medicalClinicSchema()];

  return (
    <html lang={locale} className={`${jakarta.variable} ${dmSans.variable} h-full`}>
      <head>
        <link rel="icon" href="/images/logo-icon.png" />
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <StickyBar schedule={resolvedSchedule} />
          <SiteHeader schedule={resolvedSchedule} />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCTA />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
