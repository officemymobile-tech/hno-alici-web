import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { AcuteBanner } from "@/components/home/AcuteBanner";
import { DoctorsSection } from "@/components/home/DoctorsSection";
import { InsuranceBanner } from "@/components/home/InsuranceBanner";
import { InsuranceLogos } from "@/components/shared/InsuranceLogos";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { TrustGrid } from "@/components/home/TrustGrid";
import { AboutPreview } from "@/components/home/AboutPreview";
import { LocationSection } from "@/components/home/LocationSection";
import { FaqSection } from "@/components/home/FaqSection";
import { GoogleBusinessCTA } from "@/components/shared/GoogleBusinessCTA";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AcuteBanner />
      <InsuranceLogos compact />
      <DoctorsSection />
      <InsuranceBanner />
      <ServicesPreview />
      <ReviewsSection compact />
      <TrustGrid />
      <AboutPreview />
      <FaqSection />
      <LocationSection />
      <GoogleBusinessCTA />
    </>
  );
}
