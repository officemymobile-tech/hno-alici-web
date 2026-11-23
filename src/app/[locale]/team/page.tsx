import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { SiteImage } from "@/components/ui/SiteImage";
import { images, teamStaff } from "@/content/site-content";
import { doctorsList } from "@/content/doctors-list";
import { getPageSeo } from "@/lib/page-seo";
import { getEditableImage, getEditableImagePosition, getEditableTeamStaff } from "@/lib/editable-content";
import { nameInitials } from "@/lib/initials";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const lang = locale as "de" | "tr";
  const { title, description } = await getPageSeo("team", lang, {
    title: isTr ? "Team" : "Team",
    description: isTr
      ? "Dr. Ümit Alici, Dr. Sigrid Meier ve Dr. Benjamin Alici ile KBB muayenehanemizin ekibini tanıyın — Wien Favoriten."
      : "Lernen Sie das Team unserer HNO-Ordination in Wien Favoriten kennen: Dr. Ümit Alici, Dr. Sigrid Meier, Dr. Benjamin Alici und unser Ordinationsteam.",
  });
  return { title, description };
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = (await getLocale()) as "de" | "tr";

  const teamTitle =
    lang === "tr"
      ? "KBB muayenehane ekibimiz sizin için çalışıyor"
      : "Unser HNO Ordinations-Team steht bemüht um Sie";

  const staff = getEditableTeamStaff(teamStaff);
  const heroImage = getEditableImage("ordinationHero", images.ordinationHero);
  const heroImagePosition = getEditableImagePosition("ordinationHero");

  return (
    <>
      <PageHeader title={lang === "tr" ? "Ekip" : "Team"} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {doctorsList.map((doc) => (
            <article key={doc.name} className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-cream-dark">
              <div className="relative aspect-[3/4]">
                {doc.photo ? (
                  <SiteImage
                    src={doc.photo}
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
              <div className={`p-6 ${doc.primary ? "bg-petrol text-white" : ""}`}>
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
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <SiteImage src={heroImage} alt="HNO Ordination" fill className="object-cover" objectPosition={heroImagePosition} sizes="100vw" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-petrol">{teamTitle}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-cream-dark"
            >
              {member.photo ? (
                <div className="relative aspect-square">
                  <SiteImage
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    objectPosition={member.photoPosition}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-petrol">
                  <span className="font-display text-4xl font-semibold text-gold-light">
                    {nameInitials(member.name)}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-petrol">{member.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{member.role[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
