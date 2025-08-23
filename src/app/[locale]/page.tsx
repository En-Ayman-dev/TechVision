
import dynamic from 'next/dynamic';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { getTranslations } from 'next-intl/server';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSection from '@/components/landing/HeroSection';
import PartnersSection from '@/components/landing/PartnersSection';
import AboutSection from '@/components/landing/AboutSection';
import ServicesSection from '@/components/landing/ServicesSection';
import WhyChooseUsSection from '@/components/landing/WhyChooseUsSection';
import FaqSection from '@/components/landing/FaqSection';
import CtaSection from '@/components/landing/CtaSection';
import BlogPage from './blog/page';
import { ContactSectionEnhanced } from '@/components/landing/ContactSectionEnhanced';
import StudentServiceSection from '@/components/landing/StudentServiceSection';


export const revalidate = 60; // Revalidate every 60 seconds

// Dynamically import the Portfolio section as it is a client component with state
const PortfolioSection = dynamic(() => import('@/components/landing/PortfolioSection'), {
  loading: () => <div className="container"><Skeleton className="h-[600px] w-full" /></div>,
  ssr: true,
});

const TeamSection = dynamic(() => import('@/components/landing/TeamSection'), {
  loading: () => <div className="container"><Skeleton className="h-[400px] w-full" /></div>,
  ssr: true,
});
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
  loading: () => <div className="container"><Skeleton className="h-[400px] w-full" /></div>,
  ssr: true,
});


export default async function Home() {
  const t = await getTranslations();
  
  return (
    <>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <PartnersSection />
          <AboutSection />
          <ServicesSection />
          <WhyChooseUsSection />
          <StudentServiceSection />

          <PortfolioSection projects={[]} />
          <TeamSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
          <BlogPage />
          <ContactSectionEnhanced />
        </main>
        <Footer />
      </div>
    </>
  );
}

