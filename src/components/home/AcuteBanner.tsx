import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export async function AcuteBanner() {
  const t = await getTranslations("acute");

  return (
    <section className="relative -mt-12 z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-petrol/10 ring-1 ring-cream-dark sm:p-10 lg:p-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Akutversorgung
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-petrol sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-xl font-medium text-petrol-light">{t("subtitle")}</p>
            <p className="mt-4 max-w-xl text-text-muted">{t("text")}</p>
          </div>
          <Button href={`tel:${siteConfig.phone}`} variant="secondary" size="lg" external className="shrink-0">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
