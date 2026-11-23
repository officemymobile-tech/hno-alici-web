import { getTranslations } from "next-intl/server";
import { ServiceIcon, type IconKey } from "@/components/icons/ServiceIcon";

const trustIcons: Record<string, IconKey> = {
  experience: "stethoscope",
  children: "children",
  turkish: "languages",
  insurance: "badge-check",
};

export async function TrustGrid() {
  const t = await getTranslations("trust");
  const items = ["experience", "children", "turkish", "insurance"] as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h2 className="text-center font-display text-4xl font-semibold text-petrol">
        {t("title")}
      </h2>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((key) => (
          <article key={key} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-petrol">
              <ServiceIcon name={trustIcons[key]} size={24} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-petrol">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t(`items.${key}.text`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
