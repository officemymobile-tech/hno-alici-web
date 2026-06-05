import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export async function ContactCard() {
  const t = await getTranslations("contact");

  return (
    <div className="rounded-2xl bg-petrol p-8 text-white shadow-xl">
      <h3 className="font-display text-2xl font-semibold">{t("title")}</h3>
      <address className="mt-6 space-y-3 not-italic text-white/85">
        <p>{t("address")}</p>
        <p>
          <a href={`tel:${siteConfig.phone}`} className="hover:text-gold">
            {t("phone")}
          </a>
        </p>
        <p>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-gold">
            {t("email")}
          </a>
        </p>
      </address>
      <Button
        href={siteConfig.mapsUrl}
        variant="primary"
        size="sm"
        external
        className="mt-6"
      >
        {t("maps")}
      </Button>
    </div>
  );
}
