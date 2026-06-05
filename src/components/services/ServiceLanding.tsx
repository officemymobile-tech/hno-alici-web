import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { InsuranceLogos } from "@/components/shared/InsuranceLogos";
import type { SeoServiceContent } from "@/content/seo-services";
import { siteConfig } from "@/lib/site";

type Props = {
  content: SeoServiceContent;
  lang: "de" | "tr";
  locale: string;
};

export function ServiceLanding({ content, lang, locale }: Props) {
  return (
    <>
      <section className="gradient-hero px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{content.h1[lang]}</h1>
          <p className="mt-4 text-lg text-white/80">{content.intro[lang]}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <SiteImage src={content.image} alt={content.h1[lang]} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-petrol">
                {lang === "tr" ? "Belirtiler" : "Symptome"}
              </h2>
              <ul className="mt-4 space-y-2">
                {content.symptoms[lang].map((s) => (
                  <li key={s} className="flex gap-2 text-text-muted"><span className="text-gold">•</span>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-petrol">
                {lang === "tr" ? "Tedaviler" : "Behandlungen"}
              </h2>
              <ul className="mt-4 space-y-2">
                {content.treatments[lang].map((t) => (
                  <li key={t} className="flex gap-2 text-text-muted"><span className="text-gold">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {content.faq.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-petrol">FAQ</h2>
            <dl className="mt-6 space-y-4">
              {content.faq.map((item) => (
                <div key={item.q.de} className="rounded-xl bg-white p-6 ring-1 ring-cream-dark">
                  <dt className="font-semibold text-petrol">{item.q[lang]}</dt>
                  <dd className="mt-2 text-text-muted">{item.a[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href={`tel:${siteConfig.phone}`} variant="primary" size="lg" external data-cta="service-phone">
            {lang === "tr" ? "Hemen ara" : "Jetzt anrufen"}
          </Button>
          <Button href={`/${locale}/termin`} variant="secondary" size="lg" data-cta="service-online">
            {lang === "tr" ? "Randevu" : "Termin anfragen"}
          </Button>
        </div>
      </div>
      <InsuranceLogos compact />
    </>
  );
}
