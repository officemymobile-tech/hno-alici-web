import Link from "next/link";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { doctorProfile } from "@/content/doctor-profile";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const lang = (await getLocale()) as "de" | "tr";

  const subpages = [
    { key: "cv", href: "lebenslauf" },
    { key: "qualifications", href: "qualifikationen" },
    { key: "philosophy", href: "philosophie" },
  ] as const;

  return (
    <>
      <section className="gradient-hero px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/20">
            <SiteImage src={doctorProfile.portrait} alt="Dr. Ümit Alici" fill priority className="object-cover" sizes="400px" />
          </div>
          <div className="text-white">
            <h1 className="font-display text-4xl font-semibold sm:text-5xl">{doctorProfile.name}</h1>
            <p className="mt-4 text-xl text-white/85">{doctorProfile.tagline[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {doctorProfile.usps[lang].map((u) => (
                <span key={u} className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-lg leading-relaxed text-text-muted">{t("intro")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {subpages.map((page) => (
            <Link
              key={page.key}
              href={`/${lang}/dr-uemit-alici/${page.href}`}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-cream-dark transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="font-display text-xl font-semibold text-petrol">{tNav(page.key)}</h2>
            </Link>
          ))}
        </div>
        <blockquote className="mt-12 border-l-4 border-gold pl-6 font-display text-2xl italic text-petrol">
          „{doctorProfile.philosophy[lang]}"
        </blockquote>
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-petrol">
              {lang === "tr" ? "Neden KBB?" : "Warum HNO?"}
            </h2>
            <p className="mt-4 text-text-muted">{t("whyHno")}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-petrol">
              {lang === "tr" ? "Beklentileriniz" : "Was Sie erwarten dürfen"}
            </h2>
            <p className="mt-4 text-text-muted">{t("expectations")}</p>
          </div>
        </section>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={`/${lang}/termin`} variant="secondary" data-cta="doctor-online">
            {tNav("appointment")}
          </Button>
          <Button
            href={lang === "tr" ? `/${lang}/turk-kbb-doktoru-wien` : `/${lang}/tuerkischer-hno-arzt-wien`}
            variant="primary"
          >
            {lang === "tr" ? "Türkçe bilgi" : "Türkischsprachige Betreuung"}
          </Button>
        </div>
      </div>
    </>
  );
}
