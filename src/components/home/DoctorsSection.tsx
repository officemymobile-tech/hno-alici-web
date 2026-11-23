import { getTranslations, getLocale } from "next-intl/server";
import { doctorsList } from "@/content/doctors-list";
import { SiteImage } from "@/components/ui/SiteImage";
import { nameInitials } from "@/lib/initials";

export async function DoctorsSection() {
  const t = await getTranslations("doctors");
  const locale = await getLocale();
  const lang = locale as "de" | "tr";

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold-ink">
          {t("title")}
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {doctorsList.map((doc) => {
            const photo = doc.photo;
            return (
              <article
                key={doc.name}
                className={`overflow-hidden rounded-2xl ring-1 transition hover:-translate-y-1 hover:shadow-xl ${
                  doc.primary ? "shadow-xl shadow-petrol/20 ring-petrol" : "shadow-sm ring-cream-dark"
                }`}
              >
                <div className="relative aspect-[3/4]">
                  {photo ? (
                    <SiteImage
                      src={photo}
                      alt={doc.name}
                      fill
                      className="object-cover"
                      objectPosition={doc.photoPosition}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-petrol">
                      <span className="font-display text-5xl font-semibold text-gold-light">
                        {nameInitials(doc.name)}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-6 text-center ${doc.primary ? "bg-petrol text-white" : "bg-cream"}`}>
                  <h2 className="font-display text-2xl font-semibold">{doc.name}</h2>
                  <p className={`mt-2 text-sm ${doc.primary ? "text-white/80" : "text-text-muted"}`}>
                    {doc.title[lang]}
                  </p>
                  {doc.primary && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gold-light">
                      {lang === "tr" ? "Baş hekim" : "Hauptansprechpartner"}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
