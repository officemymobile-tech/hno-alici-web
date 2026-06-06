import { getLocale, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import { doctors, images, teamStaff } from "@/content/site-content";
import { doctorProfile } from "@/content/doctor-profile";
import { getEditableImage, getEditableTeamStaff } from "@/lib/editable-content";

type Props = { params: Promise<{ locale: string }> };

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
  const portrait = getEditableImage("drAliciPortrait", images.drAliciPortrait);
  const doctorPhotos: Record<string, string> = {
    "Dr. Ümit Alici": portrait,
    "Dr. Benjamin Alici": images.leistungenFoto10,
  };

  return (
    <>
      <PageHeader title={lang === "tr" ? "Ekip" : "Team"} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {doctors.map((doc) => (
            <article key={doc.name} className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-cream-dark">
              <div className="relative aspect-[3/4]">
                {"anonymous" in doc && doc.anonymous ? (
                  <div
                    className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-petrol to-petrol-dark p-8"
                    aria-hidden
                  >
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 ring-2 ring-gold/40 sm:h-32 sm:w-32">
                      <ServiceIcon name="user" size={48} className="text-white/90" />
                    </div>
                  </div>
                ) : (
                  <SiteImage
                    src={doctorPhotos[doc.name] ?? images.drAliciPortrait}
                    alt={doc.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className={`p-6 ${doc.primary ? "bg-petrol text-white" : ""}`}>
                <h2 className="font-display text-2xl font-semibold">{doc.name}</h2>
                <p className={`mt-2 text-sm ${doc.primary ? "text-white/80" : "text-text-muted"}`}>
                  {doc.title[lang]}
                </p>
                {doc.primary && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gold">
                    {lang === "tr" ? "Baş hekim" : "Hauptansprechpartner"}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <SiteImage src={heroImage} alt="HNO Ordination" fill className="object-cover" sizes="100vw" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-petrol">{teamTitle}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <article key={member.name} className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-cream-dark">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-petrol">
                <ServiceIcon name="health" size={22} />
              </span>
              <div>
                <h3 className="font-semibold text-petrol">{member.name}</h3>
                <p className="mt-1 text-sm text-text-muted">{member.role[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
