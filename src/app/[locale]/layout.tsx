import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { StickyBar } from "@/components/layout/StickyBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { AnnouncementBanner } from "@/components/shared/AnnouncementBanner";
import { siteConfig } from "@/lib/site";
import { medicalClinicSchema, physicianSchema } from "@/lib/schema";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
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
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    keywords: t("keywords"),
    alternates: {
      canonical: `${siteConfig.domain}/${locale}`,
      languages: {
        de: `${siteConfig.domain}/de`,
        tr: `${siteConfig.domain}/tr`,
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
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable} h-full`}>
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
          <StickyBar />
          <AnnouncementBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCTA />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
