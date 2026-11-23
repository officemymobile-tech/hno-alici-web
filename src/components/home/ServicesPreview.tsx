import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { ServiceIcon, serviceSlugToIcon } from "@/components/icons/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import type { ServiceSlug } from "@/lib/site";
import { images } from "@/content/site-content";
import { seoServices } from "@/content/seo-services";
import { getEditableText, getEditableImage, getEditableImagePosition, editableImageKeys } from "@/lib/editable-content";

// 4 of the site's 7 real, already-published Leistungen (every slug has its
// own dedicated page, see src/content/seo-services.ts) — no new/invented
// category, just a featured subset for the homepage. Each card's photo is
// one of the practice's own existing real photos (no stock imagery), picked
// so the 4 cards show 4 visually distinct images rather than repeating one.
// Each card now has its own dedicated, independent editableImages key
// (homeServiceCard*) — changing one in Studio cannot affect another card or
// any other image on the site, unlike reusing a shared key would have.
const featured: {
  slug: ServiceSlug;
  imageKey: (typeof editableImageKeys)[number];
  localImage: string;
  focus: "object-center" | "object-top";
}[] = [
  { slug: "allgemeine-hno", imageKey: "homeServiceCardAllgemeineHno", localImage: images.ordinationHero, focus: "object-center" },
  { slug: "kinder-hno", imageKey: "homeServiceCardKinderHno", localImage: images.leistungenOverview, focus: "object-top" },
  { slug: "hoertest", imageKey: "homeServiceCardHoertest", localImage: images.leistungenFoto09, focus: "object-center" },
  { slug: "allergologie", imageKey: "homeServiceCardAllergologie", localImage: images.leistungenFoto10, focus: "object-center" },
];

export async function ServicesPreview() {
  const t = await getTranslations("services");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-ink">
          {getEditableText("services", "title", lang, t("title"))}
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-petrol sm:text-5xl">
          {getEditableText("services", "subtitle", lang, t("subtitle"))}
        </h2>
      </div>
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map(({ slug, imageKey, localImage, focus }) => {
          // Reads the same Sanity-connected service document ServiceLanding
          // (the detail page) uses, not the separate messages.services.*
          // next-intl keys — closes the content-drift gap where editing a
          // service in Studio previously updated the detail page but silently
          // left this homepage card showing the old wording.
          const title = seoServices[slug].shortTitle[lang];
          const text = seoServices[slug].cardText[lang];
          const icon = serviceSlugToIcon(slug);
          const image = getEditableImage(imageKey, localImage);
          const imagePosition = getEditableImagePosition(imageKey);
          return (
            <Link
              key={slug}
              href={`/${locale}/leistungen/${slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-cream-dark transition hover:-translate-y-1 hover:shadow-2xl hover:ring-petrol/15"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <SiteImage
                  src={image}
                  alt={title}
                  fill
                  className={`object-cover ${focus} transition duration-500 group-hover:scale-105`}
                  objectPosition={imagePosition}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute bottom-0 left-4 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl bg-white text-petrol shadow-lg ring-1 ring-black/5 transition group-hover:bg-petrol group-hover:text-white">
                  <ServiceIcon name={icon} size={26} />
                </span>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
                <h3 className="font-display text-xl font-semibold text-petrol group-hover:text-petrol-light">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-text-muted">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink transition group-hover:gap-2.5">
                  {lang === "tr" ? "Detaylar" : "Mehr erfahren"}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <Link
          href={`/${locale}/leistungen`}
          className="inline-flex items-center gap-2 rounded-full bg-petrol px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-petrol-light"
        >
          {locale === "tr" ? "Tüm hizmetler" : "Alle Leistungen ansehen"}
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
