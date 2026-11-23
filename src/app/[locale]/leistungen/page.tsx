import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { leistungenContent, images } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { getPageSeo } from "@/lib/page-seo";
import { getEditableText, getEditableImage, getEditableImagePosition } from "@/lib/editable-content";

const sectionImageKey: Record<string, "leistungenPageAllgemeineHno" | "leistungenPageKinderHno" | "leistungenPageAllergologie"> = {
  "allgemeine-hno": "leistungenPageAllgemeineHno",
  "kinder-hno": "leistungenPageKinderHno",
  allergologie: "leistungenPageAllergologie",
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale as "de" | "tr";
  const { title, description } = await getPageSeo("leistungen", lang, {
    title: lang === "tr" ? "Hizmetler" : "Leistungen",
    description: leistungenContent.intro[lang],
  });
  return { title, description };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <>
      <PageHeader
        title={lang === "tr" ? "Hizmetler" : "Leistungen"}
        subtitle={getEditableText("leistungenOverview", "intro", lang, leistungenContent.intro[lang])}
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
                src={getEditableImage(sectionImageKey[section.id], section.image)}
                alt={section.title[lang]}
                fill
                className="object-cover"
                objectPosition={getEditableImagePosition(sectionImageKey[section.id])}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-petrol">
                <ServiceIcon name={section.iconKey} size={28} />
              </span>
              <h2 className="font-display text-3xl font-semibold text-petrol">
                {getEditableText("leistungenOverview", `${section.id}Title`, lang, section.title[lang])}
              </h2>
              {"subtitle" in section && section.subtitle && (
                <p className="mt-2 font-medium text-gold-ink">
                  {getEditableText("leistungenOverview", `${section.id}Subtitle`, lang, section.subtitle[lang])}
                </p>
              )}
              {"description" in section && section.description && (
                <p className="mt-4 text-text-muted">
                  {getEditableText("leistungenOverview", `${section.id}Description`, lang, section.description[lang])}
                </p>
              )}
              <ul className="mt-6 space-y-2">
                {section.items[lang].map((item, i) => {
                  // Self-fallback, same pattern as AboutPreview's checklist —
                  // each bullet's own current text is the fallback, so no
                  // separate pre-seed is needed and the override key only
                  // matters once an editor actually changes that one item.
                  const text = getEditableText("leistungenOverview", `${section.id}Item${i + 1}`, lang, item);
                  return (
                    <li key={i} className="flex gap-3 text-text-muted">
                      <span className="text-gold-ink">✓</span>
                      {text}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ))}

        <div className="rounded-2xl bg-petrol p-10 text-center text-white">
          <p className="font-display text-2xl font-semibold">
            {getEditableText("leistungenOverview", "acuteNote", lang, leistungenContent.acuteNote[lang])}
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
