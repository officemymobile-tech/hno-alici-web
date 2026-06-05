import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { StarRating } from "@/components/reviews/StarRating";
import { images } from "@/content/site-content";
import { doctorProfile } from "@/content/doctor-profile";
import { reviewPlatforms } from "@/content/reviews";
import { siteConfig } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("hero");
  const tAcute = await getTranslations("acute");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-petrol-dark">
      <div className="absolute inset-0">
        <SiteImage
          src={images.ordinationHero}
          alt="HNO Ordination Wien"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-dark/95 via-petrol/85 to-petrol/50" />
      </div>

      <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-2 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-semibold text-gold">
            {tAcute("subtitle")}
          </p>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">{t("eyebrow")}</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-xl text-white/90">{t("subtitle")}</p>
          <p className="mt-2 text-lg text-white/70">{doctorProfile.tagline[lang]}</p>

          <Link
            href={reviewPlatforms.google.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur transition hover:bg-white/20"
          >
            <StarRating rating={reviewPlatforms.google.rating} size="sm" />
            <span className="text-sm text-white/90">Google · {reviewPlatforms.google.reviewCount}+</span>
          </Link>

          {/* A/B: Telefon (primary) vs Online (secondary) */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${siteConfig.phone}`}
              data-cta="hero-phone"
              className="flex flex-col items-center rounded-2xl bg-gold px-6 py-5 text-center shadow-xl shadow-gold/25 transition hover:bg-gold-light"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-petrol-dark/70">
                {lang === "tr" ? "Önerilen" : "Empfohlen"}
              </span>
              <span className="mt-1 text-lg font-bold text-petrol-dark">{t("ctaAppointment")}</span>
              <span className="mt-1 text-sm text-petrol-dark/80">{siteConfig.phoneDisplay}</span>
            </a>
            <Button
              href={`/${locale}/termin`}
              variant="outline"
              size="lg"
              className="h-full min-h-[88px] flex-col gap-1 border-white/40 py-5"
              data-cta="hero-online"
            >
              <span className="text-xs uppercase tracking-widest opacity-70">Online</span>
              <span>{lang === "tr" ? "Form ile randevu" : "Anfrage senden"}</span>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-gold/30">
            <SiteImage
              src={doctorProfile.portrait}
              alt="Dr. Ümit Alici – HNO Facharzt Wien"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 400px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
