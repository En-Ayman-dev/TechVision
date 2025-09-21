
// src/app/[locale]/page.tsx

import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import HeroSection from '@/components/landing/HeroSection';
import CtaSection from '@/components/landing/CtaSection';
import { BlogSystem } from '@/components/blog/blog-system';
import PartnersSection from '@/components/landing/PartnersSection';
import TeamSection from '@/components/landing/TeamSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import ServicesSection from '@/components/landing/ServicesSection'; 
import { getServicesAction, getPartnersAction, getTestimonialsAction, getBlogPostsAction, getTeamAction } from '../actions';


export const revalidate = 3600; 


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
        <div className="relative pt-16 md:pt-20"> 
            <HeroSection />
            <AboutSection />
            <ServicesSection services={services} />
            <TestimonialsSection testimonials={testimonials} />
            <PartnersSection partners={partners} />
            <BlogSystem posts={blogPosts} />
            <TeamSection teams={teams} />
            <FaqSection />
            <CtaSection />
        </div>
    );
}
