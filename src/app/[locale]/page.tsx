import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import HeroSection from '@/components/landing/HeroSection';
import CtaSection from '@/components/landing/CtaSection';
import { getServicesAction, getPartnersAction, getTestimonialsAction, getBlogPostsAction } from '@/app/actions';
import BlogPage from './blog/page';
import PartnersPage from './partners/page';
import TeamPage from './team/page';
import TestimonialsPage from './testimonials/page';

export default async function Home() {
  const [
    services,
    partners,
    testimonials,
  ] = await Promise.all([
    getServicesAction(),
    getPartnersAction(),
    getTestimonialsAction(),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <PartnersPage />
      <TestimonialsPage />
      <BlogPage />
      <TeamPage />
      <FaqSection />
      <CtaSection />
    </>
  );
}