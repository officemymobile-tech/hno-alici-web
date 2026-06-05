import { getTranslations } from "next-intl/server";

export async function InsuranceBanner() {
  const t = await getTranslations("insurance");

  return (
    <section className="bg-gold py-6">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-display text-2xl font-semibold text-petrol-dark sm:text-3xl">
          {t("title")}
        </p>
      </div>
    </section>
  );
}
