// import { AboutSection } from "@/components/landing/AboutSection";
// import { TeamSection } from "@/components/landing/TeamSection";
// import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
// import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
// import { CtaSection } from "@/components/landing/CtaSection";

import AboutSection from "@/components/landing/AboutSection";
import CtaSection from "@/components/landing/CtaSection";
import TeamSection from "@/components/landing/TeamSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";

export default function AboutPage() {
  return (
    <>
      <WhyChooseUsSection />
      <AboutSection />
      <TeamSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}