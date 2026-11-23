import { getTranslations, getLocale } from "next-intl/server";
import { Users, Stethoscope, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { images } from "@/content/site-content";
import { doctorProfile } from "@/content/doctor-profile";
import { getEditableImage, getEditableImagePosition, getEditableText } from "@/lib/editable-content";
import { siteConfig } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";
  const portrait = getEditableImage("drAliciPortrait", doctorProfile.portrait);
  const portraitPosition = getEditableImagePosition("drAliciPortrait") ?? doctorProfile.portraitPosition;

  const badges = [
    { Icon: Users, label: getEditableText("heroBadges", "family", lang, t("badges.family")) },
    { Icon: Stethoscope, label: getEditableText("heroBadges", "diagnostics", lang, t("badges.diagnostics")) },
    { Icon: ShieldCheck, label: getEditableText("heroBadges", "trust", lang, t("badges.trust")) },
  ];

  return (
    <section className="relative overflow-hidden bg-petrol-dark">
      {/* Mobile: a shorter photo band above the text — no large side-bleed room at this width. */}
      <div className="relative aspect-[16/10] w-full lg:hidden">
        <SiteImage
          src={portrait}
          alt="Dr. Ümit Alici – HNO Facharzt Wien"
          fill
          preload
          fetchPriority="high"
          className="object-cover object-top"
          objectPosition={portraitPosition}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-dark via-petrol-dark/10 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="relative z-10 flex flex-col justify-center px-4 py-14 sm:px-6 lg:px-16 lg:py-28 xl:px-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            {getEditableText("hero", "eyebrow", lang, t("eyebrow"))}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-[4rem]">
            {getEditableText("hero", "title", lang, t("title"))}
          </h1>
          <p className="mt-6 max-w-xl text-2xl font-medium leading-snug text-white/90">
            {getEditableText("hero", "subtitle", lang, t("subtitle"))}
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
            {getEditableText("hero", "tagline", lang, doctorProfile.tagline[lang])}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              data-cta="hero-phone"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-bold text-petrol-dark shadow-xl shadow-gold/25 transition hover:-translate-y-0.5 hover:bg-gold-light"
            >
              {getEditableText("hero", "ctaAppointment", lang, t("ctaAppointment"))}
            </a>
            <Button
              href={`/${locale}/termin`}
              variant="outline"
              size="lg"
              className="border-2 border-white/50 px-8 py-4 text-lg font-semibold"
              data-cta="hero-online"
            >
              {siteConfig.phoneDisplay}
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {badges.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-base font-medium text-white/85">
                <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: large side-bleed photo, no card frame — matches the reference's full-bleed hero photo. */}
        <div className="relative hidden min-h-[720px] lg:block">
          <SiteImage
            src={portrait}
            alt="Dr. Ümit Alici – HNO Facharzt Wien"
            fill
            preload
            fetchPriority="high"
            className="object-cover"
            objectPosition={portraitPosition}
            sizes="50vw"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-petrol-dark to-transparent" />
        </div>
      </div>
    </section>
  );
}
