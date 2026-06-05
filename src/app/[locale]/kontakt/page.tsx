import Link from "next/link";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { HoursCard } from "@/components/shared/HoursCard";
import { GoogleMapEmbed, MapDirectionsPanel } from "@/components/maps/GoogleMapEmbed";
import { PlatformRatingCard } from "@/components/reviews/PlatformRatingCard";
import { Button } from "@/components/ui/Button";
import { facebookUrl, kontaktContent } from "@/content/site-content";
import { reviewPlatforms } from "@/content/reviews";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";
  const t = await getTranslations("contact");

  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={lang === "tr" ? "Bize ulaşın!" : "Kontaktieren Sie uns!"}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-lg font-medium text-petrol">
          {kontaktContent.appointmentNote[lang]}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Telefon", value: t("phone"), href: `tel:${siteConfig.phone}` },
            { label: lang === "tr" ? "Muayenehane" : "Ordination", value: t("address") },
            { label: "E-Mail", value: t("email"), href: `mailto:${siteConfig.email}` },
            { label: "Facebook", value: lang === "tr" ? "Takip edin" : "Folgen", href: facebookUrl },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-cream-dark transition hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">{item.label}</p>
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
          <MapDirectionsPanel lang={lang} />
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
            {t("maps")}
          </Button>
          <Button href={reviewPlatforms.google.url} variant="primary" external>
            Google Maps
          </Button>
        </div>
      </div>
    </>
  );
}
