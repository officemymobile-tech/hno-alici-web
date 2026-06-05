import Image from "next/image";
import { getLocale } from "next-intl/server";
import { kassen } from "@/content/doctor-profile";

export async function InsuranceLogos({ compact }: { compact?: boolean }) {
  const lang = (await getLocale()) as "de" | "tr";

  return (
    <section className={compact ? "py-8" : "py-16"} aria-label={lang === "tr" ? "Sigorta kurumları" : "Krankenkassen"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            {lang === "tr" ? "Sigorta anlaşmaları" : "Krankenkassen"}
          </p>
        )}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 ${compact ? "" : "mt-8"}`}
        >
          {kassen.map((k) => (
            <a
              key={k.id}
              href={k.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[88px] min-w-[148px] flex-col items-center justify-center rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-cream-dark transition hover:-translate-y-0.5 hover:ring-petrol/20"
              title={k.fullName[lang]}
            >
              <Image
                src={k.logo}
                alt={k.fullName[lang]}
                width={k.id === "oegk" ? 120 : 100}
                height={40}
                className="h-10 w-auto max-w-[120px] object-contain"
              />
              {!compact && (
                <span className="mt-2 text-center text-[11px] leading-tight text-text-muted">
                  {k.name}
                </span>
              )}
            </a>
          ))}
          <div className="flex h-[88px] min-w-[148px] flex-col items-center justify-center rounded-xl bg-gold/15 px-6 py-4 ring-1 ring-gold/30">
            <span className="font-display text-lg font-semibold text-petrol">
              {lang === "tr" ? "Özel" : "Privat"}
            </span>
            {!compact && (
              <span className="mt-1 text-[11px] text-text-muted">
                {lang === "tr" ? "Özel hasta" : "Privatpatienten"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
