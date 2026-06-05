import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { images } from "@/content/site-content";

export async function AboutPreview() {
  const t = await getTranslations("about");
  const locale = await getLocale();

  return (
    <section className="bg-accent-soft/50 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
          <SiteImage
            src={images.drAliciPortrait}
            alt="Dr. Ümit Alici – Facharzt HNO Wien"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="font-display text-4xl font-semibold text-petrol">{t("title")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-text-muted">{t("intro")}</p>
          <blockquote className="mt-8 border-l-4 border-gold pl-6 font-display text-xl italic text-petrol">
            „{t("philosophy")}"
          </blockquote>
          <Button href={`/${locale}/team`} variant="secondary" size="md" className="mt-8">
            {locale === "tr" ? "Ekibi tanıyın" : "Team kennenlernen"}
          </Button>
        </div>
      </div>
    </section>
  );
}
