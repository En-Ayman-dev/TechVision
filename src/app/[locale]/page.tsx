
import dynamic from 'next/dynamic';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/landing/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const PartnersSection = dynamic(() => import('@/components/landing/PartnersSection'), { loading: () => <Skeleton className="h-40 w-full" /> });
const AboutSection = dynamic(() => import('@/components/landing/AboutSection'));
const ServicesSection = dynamic(() => import('@/components/landing/ServicesSection'), { loading: () => <Skeleton className="h-96 w-full" /> });
const WhyChooseUsSection = dynamic(() => import('@/components/landing/WhyChooseUsSection'));
const PortfolioSection = dynamic(() => import('@/components/landing/PortfolioSection'), { loading: () => <Skeleton className="h-[600px] w-full" /> });
const TeamSection = dynamic(() => import('@/components/landing/TeamSection'), { loading: () => <Skeleton className="h-96 w-full" /> });
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), { loading: () => <Skeleton className="h-96 w-full" /> });
const FaqSection = dynamic(() => import('@/components/landing/FaqSection'));
const CtaSection = dynamic(() => import('@/components/landing/CtaSection'));
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'));

export default function Home() {
  return (
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
  );
}
