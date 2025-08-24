import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import HeroSection from '@/components/landing/HeroSection';
import CtaSection from '@/components/landing/CtaSection';
import BlogPage from './blog/page';
import PartnersPage from './partners/page';
import TeamPage from './team/page';
import TestimonialsPage from './testimonials/page';

export default async function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TestimonialsPage />
      <PartnersPage />
      <BlogPage />
      <TeamPage />
      <FaqSection />
      <CtaSection />
    </>
  );
}