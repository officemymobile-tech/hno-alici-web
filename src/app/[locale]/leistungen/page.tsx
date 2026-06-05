import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { leistungenContent, images } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader
        title={lang === "tr" ? "Hizmetler" : "Leistungen"}
        subtitle={leistungenContent.intro[lang]}
      />

      <div className="relative h-48 w-full overflow-hidden">
        <SiteImage
          src={images.ordinationBanner}
          alt="HNO Alici Leistungen"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
        {leistungenContent.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
              <SiteImage
                src={section.image}
                alt={section.title[lang]}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-petrol">
                <ServiceIcon name={section.iconKey} size={28} />
              </span>
              <h2 className="font-display text-3xl font-semibold text-petrol">
                {section.title[lang]}
              </h2>
              {"subtitle" in section && section.subtitle && (
                <p className="mt-2 font-medium text-gold">{section.subtitle[lang]}</p>
              )}
              {"description" in section && section.description && (
                <p className="mt-4 text-text-muted">{section.description[lang]}</p>
              )}
              <ul className="mt-6 space-y-2">
                {section.items[lang].map((item) => (
                  <li key={item} className="flex gap-3 text-text-muted">
                    <span className="text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <div className="rounded-2xl bg-petrol p-10 text-center text-white">
          <p className="font-display text-2xl font-semibold">
            {leistungenContent.acuteNote[lang]}
          </p>
          <p className="mt-2 text-white/75">
            {lang === "tr" ? "Fachärztliche Betreuung" : "Fachärztliche Betreuung"}
          </p>
          <Button href={`tel:${siteConfig.phone}`} variant="primary" size="lg" external className="mt-6">
            {lang === "tr" ? "Hemen arayın" : "Jetzt anrufen"}
          </Button>
        </div>
      </div>
    </>
  );
}
