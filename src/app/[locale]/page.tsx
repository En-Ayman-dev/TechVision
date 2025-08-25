// src/app/[locale]/page.tsx

import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import HeroSection from '@/components/landing/HeroSection';
import CtaSection from '@/components/landing/CtaSection';
import { BlogSystem } from '@/components/blog/blog-system';
import PartnersSection from '@/components/landing/PartnersSection';
import TeamSection from '@/components/landing/TeamSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { getServicesAction, getPartnersAction, getTestimonialsAction, getBlogPostsAction, getTeamAction } from '../actions';

export default async function Home() {
    const [
    services,
    partners,
    testimonials,
    teams,
    blogPosts
  ] = await Promise.all([
    getServicesAction(),
    getPartnersAction(),
    getTestimonialsAction(),
    getTeamAction(),
    getBlogPostsAction(),
  ]);
  return (
    <div className="pt-16"> {/* تم إضافة هذا الـ div */}
      <HeroSection />
      <AboutSection />
      <TestimonialsSection testimonials={testimonials} />
      <PartnersSection partners={partners} />
      <BlogSystem posts={blogPosts} />
      <TeamSection teams={teams} />
      <FaqSection />
      <CtaSection />
    </div>
  );
}