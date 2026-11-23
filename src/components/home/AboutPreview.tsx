import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { SiteImage } from "@/components/ui/SiteImage";
import { images } from "@/content/site-content";
import { getEditableImage, getEditableText } from "@/lib/editable-content";

export async function AboutPreview() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";
  const portrait = getEditableImage("drAliciPortrait", images.drAliciPortrait);
  const localChecklist = t.raw("checklist") as string[];
  const checklist = localChecklist.map((item, i) => getEditableText("about", `checklist${i + 1}`, lang, item));

  return (
    <section className="bg-accent-soft/50 py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl min-w-0 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="relative aspect-[4/5] min-w-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
          <SiteImage
            src={portrait}
            alt="Dr. Ümit Alici – Facharzt HNO Wien"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-ink">
            {getEditableText("about", "eyebrow", lang, t("eyebrow"))}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-petrol sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            {getEditableText("about", "title", lang, t("title"))}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl">
            {getEditableText("about", "intro", lang, t("intro"))}
          </p>
          <ul className="mt-8 space-y-4">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-text sm:text-lg">
                <Check className="mt-1 h-6 w-6 shrink-0 text-gold-ink" strokeWidth={2.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 border-l-4 border-gold pl-6 font-display text-xl italic leading-snug text-petrol sm:text-2xl">
            „{getEditableText("about", "philosophy", lang, t("philosophy"))}“
          </blockquote>
          <Link
            href={`/${locale}/team`}
            className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-gold px-8 py-3.5 text-base font-semibold text-petrol transition hover:bg-gold hover:text-petrol-dark"
          >
            {locale === "tr" ? "Ekibi tanıyın" : "Team kennenlernen"}
          </Link>
        </div>
      </div>
    </section>
  );
}
