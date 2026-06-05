import { getTranslations, getLocale } from "next-intl/server";
import { doctors } from "@/content/site-content";

export async function DoctorsSection() {
  const t = await getTranslations("doctors");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          {t("title")}
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {doctors.map((doc) => (
            <article
              key={doc.name}
              className={`rounded-2xl p-8 text-center ring-1 ${
                doc.primary
                  ? "bg-petrol text-white ring-petrol shadow-xl shadow-petrol/20"
                  : "bg-cream ring-cream-dark"
              }`}
            >
              <h2 className="font-display text-2xl font-semibold">{doc.name}</h2>
              <p className={`mt-3 text-sm ${doc.primary ? "text-white/80" : "text-text-muted"}`}>
                {doc.title[lang]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
