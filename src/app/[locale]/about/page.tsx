import { getTeamAction } from "@/app/actions";
import AboutSection from "@/components/landing/AboutSection";
import CtaSection from "@/components/landing/CtaSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import TeamPage from "../team/page";
import TestimonialsPage from "../testimonials/page";

export default async function AboutPage() {
  const team = await getTeamAction();
  return (
    <>
      <WhyChooseUsSection />
      <AboutSection />
      <TeamPage />
      <TestimonialsPage />
      <CtaSection />
    </>
  );
}