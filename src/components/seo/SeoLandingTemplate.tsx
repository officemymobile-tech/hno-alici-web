import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { InsuranceLogos } from "@/components/shared/InsuranceLogos";
import { images } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

type LandingData = {
  h1: { de: string; tr: string };
  hero: { de: string; tr: string };
  benefits: { de: readonly string[]; tr: readonly string[] };
};

type Props = {
  data: LandingData;
  lang: "de" | "tr";
  locale: string;
  serviceLink?: string;
};

export function SeoLandingTemplate({ data, lang, locale, serviceLink }: Props) {
  return (
    <>
      <section className="gradient-hero px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{data.h1[lang]}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{data.hero[lang]}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={`tel:${siteConfig.phone}`} variant="primary" size="lg" external data-cta="phone">
              {lang === "tr" ? "Hemen ara" : "Jetzt anrufen"}
            </Button>
            <Button href={`/${locale}/termin`} variant="outline" size="lg" data-cta="online">
              {lang === "tr" ? "Randevu" : "Termin"}
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
            <SiteImage src={images.drAliciPortrait} alt="Dr. Ümit Alici" fill className="object-cover" sizes="50vw" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-petrol">Dr. Ümit Alici</h2>
            <ul className="mt-8 space-y-4">
              {data.benefits[lang].map((b) => (
                <li key={b} className="flex gap-3 text-text-muted">
                  <span className="text-gold">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            {serviceLink && (
              <Link href={serviceLink} className="mt-8 inline-block font-semibold text-petrol hover:text-petrol-light">
                {lang === "tr" ? "Hizmetler →" : "Leistungen →"}
              </Link>
            )}
          </div>
        </div>
      </div>
      <InsuranceLogos compact />
    </>
  );
}
