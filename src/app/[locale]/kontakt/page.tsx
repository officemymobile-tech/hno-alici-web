import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { HoursCard } from "@/components/shared/HoursCard";
import { GoogleMapEmbed, MapDirectionsPanel } from "@/components/maps/GoogleMapEmbed";
import { PlatformRatingCard } from "@/components/reviews/PlatformRatingCard";
import { Button } from "@/components/ui/Button";
import { kontaktContent } from "@/content/site-content";
import { reviewPlatforms } from "@/content/reviews";
import { siteConfig } from "@/lib/site";
import { getPageSeo } from "@/lib/page-seo";
import { getEditableText } from "@/lib/editable-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const lang = locale as "de" | "tr";
  const { title, description } = await getPageSeo("kontakt", lang, {
    title: isTr ? "Kontakt & Anfahrt" : "Kontakt & Anfahrt",
    description: isTr
      ? `Wien Favoriten KBB muayenehanemize ulaşın: ${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city}. Telefon: ${siteConfig.phoneDisplay}.`
      : `Kontaktieren Sie unsere HNO-Ordination in Wien Favoriten: ${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city}. Telefon: ${siteConfig.phoneDisplay}.`,
  });
  return { title, description };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";
  const t = await getTranslations("contact");

  return (
    <>
      <PageHeader
        title={getEditableText("contact", "title", lang, t("title"))}
        subtitle={lang === "tr" ? "Bize ulaşın!" : "Kontaktieren Sie uns!"}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-lg font-medium text-petrol">
          {kontaktContent.appointmentNote[lang]}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            // siteConfig fields are already Sanity-connected (siteSettings) —
            // reading them directly here (instead of the separate, previously
            // duplicated contact.phone/address/email next-intl keys) means an
            // editor's address/phone/email change in Studio can no longer
            // drift out of sync between this page and the Footer/LocationSection.
            { label: "Telefon", value: siteConfig.phoneDisplay, href: `tel:${siteConfig.phone}` },
            {
              label: lang === "tr" ? "Muayenehane" : "Ordination",
              value: `${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city}`,
            },
            { label: "E-Mail", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
            {
              label: "Facebook",
              value: lang === "tr" ? "Takip edin" : "Folgen",
              href: siteConfig.socialLinks.find((l) => l.platform.toLowerCase().includes("facebook"))?.url,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-cream-dark transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-ink">{item.label}</p>
              {item.href ? (
                <a href={item.href} target={item.label === "Facebook" ? "_blank" : undefined} rel="noopener noreferrer" className="mt-3 block font-semibold text-petrol hover:text-petrol-light">
                  {item.value}
                </a>
              ) : (
                <p className="mt-3 text-petrol">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <GoogleMapEmbed className="aspect-[21/9] min-h-[320px]" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <MapDirectionsPanel lang={lang} headingLevel="h2" />
          <HoursCard />
        </div>

        <div className="mt-16">
          <h2 className="text-center font-display text-2xl font-semibold text-petrol">
            {lang === "tr" ? "Değerlendirmeler" : "Bewertungen"}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <PlatformRatingCard name="Google" rating={reviewPlatforms.google.rating} reviewCount={reviewPlatforms.google.reviewCount} url={reviewPlatforms.google.url} lang={lang} highlight />
            <PlatformRatingCard name="DocFinder" rating={reviewPlatforms.docfinder.rating} reviewCount={reviewPlatforms.docfinder.reviewCount} url={reviewPlatforms.docfinder.url} lang={lang} />
            <PlatformRatingCard name="Herold" rating={reviewPlatforms.herold.rating} reviewCount={reviewPlatforms.herold.reviewCount} url={reviewPlatforms.herold.url} lang={lang} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={siteConfig.directionsUrl} variant="secondary" external>
            {getEditableText("contact", "maps", lang, t("maps"))}
          </Button>
          <Button href={reviewPlatforms.google.url} variant="primary" external>
            Google Maps
          </Button>
        </div>
      </div>
    </>
  );
}
