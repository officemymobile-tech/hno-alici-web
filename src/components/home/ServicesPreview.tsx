import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { leistungenContent } from "@/content/site-content";

export async function ServicesPreview() {
  const t = await getTranslations("services");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-4xl font-semibold text-petrol">{t("title")}</h2>
        <p className="mt-4 text-lg text-text-muted">{leistungenContent.intro[lang]}</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {leistungenContent.sections.map((section) => (
          <Link
            key={section.id}
            href={`/${locale}/leistungen#${section.id}`}
            className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-cream-dark transition hover:-translate-y-1 hover:shadow-xl hover:ring-petrol/15"
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-petrol transition group-hover:bg-petrol group-hover:text-white">
              <ServiceIcon name={section.iconKey} size={28} />
            </span>
            <h3 className="font-display text-2xl font-semibold text-petrol group-hover:text-petrol-light">
              {section.title[lang]}
            </h3>
            {"description" in section && section.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {section.description[lang]}
              </p>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href={`/${locale}/leistungen`}
          className="text-sm font-semibold uppercase tracking-widest text-petrol hover:text-petrol-light"
        >
          {locale === "tr" ? "Tüm hizmetler" : "Alle Leistungen"}
        </Link>
      </div>
    </section>
  );
}
