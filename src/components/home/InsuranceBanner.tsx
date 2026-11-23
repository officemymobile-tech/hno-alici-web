import { getTranslations, getLocale } from "next-intl/server";
import { getEditableText } from "@/lib/editable-content";

export async function InsuranceBanner() {
  const t = await getTranslations("insurance");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="bg-gold/15 py-4">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-ink">
          {getEditableText("insurance", "title", lang, t("title"))}
        </p>
      </div>
    </section>
  );
}
