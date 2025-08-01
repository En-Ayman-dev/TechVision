import dynamic from 'next/dynamic';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { getTranslations } from 'next-intl/server';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'));
const PartnersSection = dynamic(() => import('@/components/landing/PartnersSection'));
const AboutSection = dynamic(() => import('@/components/landing/AboutSection'));
const ServicesSection = dynamic(() => import('@/components/landing/ServicesSection'));
const WhyChooseUsSection = dynamic(() => import('@/components/landing/WhyChooseUsSection'));
const PortfolioSection = dynamic(() => import('@/components/landing/PortfolioSection'));
const TeamSection = dynamic(() => import('@/components/landing/TeamSection'));
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'));
const FaqSection = dynamic(() => import('@/components/landing/FaqSection'));
const CtaSection = dynamic(() => import('@/components/landing/CtaSection'));
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'));


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
          <PortfolioSection />
          <TeamSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
