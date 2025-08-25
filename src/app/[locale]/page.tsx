// src/app/[locale]/page.tsx

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
    <div className="pt-16"> {/* تم إضافة هذا الـ div */}
      <HeroSection />
      <AboutSection />
      <TestimonialsPage />
      <PartnersPage />
      <BlogPage />
      <TeamPage />
      <FaqSection />
      <CtaSection />
    </div>
  );
}