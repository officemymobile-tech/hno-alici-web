import { getLocale, getTranslations } from "next-intl/server";
import { ClinicOpenStatus } from "@/components/shared/ClinicOpenStatus";
import { getEditableText } from "@/lib/editable-content";
import type { Locale } from "@/i18n/routing";

export async function HoursCard() {
  const t = await getTranslations("hours");
  const locale = (await getLocale()) as Locale;

  const days = [
    ["monday", "mondayHours"],
    ["tuesday", "tuesdayHours"],
    ["wednesday", "wednesdayHours"],
    ["thursday", "thursdayHours"],
    ["friday", "fridayHours"],
  ] as const;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-cream-dark">
      <ClinicOpenStatus variant="card" className="mb-6" />
      <h3 className="font-display text-2xl font-semibold text-petrol">{t("title")}</h3>
      <dl className="mt-6 space-y-3">
        {days.map(([day, hours]) => (
          <div key={day} className="flex justify-between gap-4 border-b border-cream-dark pb-3 text-sm last:border-0">
            <dt className="font-medium text-text">{t(day)}</dt>
            <dd className="text-right text-text-muted">
              {getEditableText("hours", hours, locale, t(hours))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
