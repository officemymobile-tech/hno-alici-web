import { getTranslations, getLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { getEditableText } from "@/lib/editable-content";

export async function AcuteBanner() {
  const t = await getTranslations("acute");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl shadow-petrol/10 ring-1 ring-cream-dark sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-ink">
              Akutversorgung
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-petrol sm:text-4xl">
              {getEditableText("acute", "title", lang, t("title"))}
            </h2>
            <p className="mt-2 text-xl font-medium text-petrol-light">
              {getEditableText("acute", "subtitle", lang, t("subtitle"))}
            </p>
            <p className="mt-4 max-w-xl text-text-muted">
              {getEditableText("acute", "text", lang, t("text"))}
            </p>
          </div>
          <Button href={`tel:${siteConfig.phone}`} variant="secondary" size="lg" external className="shrink-0">
            {getEditableText("acute", "cta", lang, t("cta"))}
          </Button>
        </div>
      </div>
    </section>
  );
}
