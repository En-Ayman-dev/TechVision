import CtaSection from "@/components/landing/CtaSection";
import FaqSection from "@/components/landing/FaqSection";
import HeroSection from "@/components/landing/HeroSection";
import PartnersSection from "@/components/landing/PartnersSection";
import TeamSection from "@/components/landing/TeamSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import BlogPage from "./blog/page";


export default function Home() {
  return (
    <>
      <HeroSection />
      <PartnersSection />
      <WhyChooseUsSection />
      <TeamSection />
      <BlogPage />
      <CtaSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}