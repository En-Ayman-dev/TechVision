// // src/app/[locale]/page.tsx

// import AboutSection from '@/components/landing/AboutSection';
// import FaqSection from '@/components/landing/FaqSection';
// import HeroSection from '@/components/landing/HeroSection';
// import CtaSection from '@/components/landing/CtaSection';
// import { BlogSystem } from '@/components/blog/blog-system';
// import PartnersSection from '@/components/landing/PartnersSection';
// import TeamSection from '@/components/landing/TeamSection';
// import TestimonialsSection from '@/components/landing/TestimonialsSection';
// import { getServicesAction, getPartnersAction, getTestimonialsAction, getBlogPostsAction, getTeamAction } from '../actions';

// export default async function Home() {
//     const [
//     services,
//     partners,
//     testimonials,
//     teams,
//     blogPosts
//   ] = await Promise.all([
//     getServicesAction(),
//     getPartnersAction(),
//     getTestimonialsAction(),
//     getTeamAction(),
//     getBlogPostsAction(),
//   ]);
//   return (
//     <div className="pt-16"> {/* تم إضافة هذا الـ div */}
//       <HeroSection />
//       <AboutSection />
//       <TestimonialsSection testimonials={testimonials} />
//       <PartnersSection partners={partners} />
//       <BlogSystem posts={blogPosts} />
//       <TeamSection teams={teams} />
//       <FaqSection />
//       <CtaSection />
//     </div>
//   );
// }

// src/app/[locale]/page.tsx

import AboutSection from '@/components/landing/AboutSection';
import FaqSection from '@/components/landing/FaqSection';
import HeroSection from '@/components/landing/HeroSection';
import CtaSection from '@/components/landing/CtaSection';
import { BlogSystem } from '@/components/blog/blog-system';
import PartnersSection from '@/components/landing/PartnersSection';
import TeamSection from '@/components/landing/TeamSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
// لاحظ أنني أضفت ServicesSection هنا لأنه يتم جلب بياناته
import ServicesSection from '@/components/landing/ServicesSection'; 
import { getServicesAction, getPartnersAction, getTestimonialsAction, getBlogPostsAction, getTeamAction } from '../actions';

// ========= START: PERFORMANCE OPTIMIZATION =========
// هذا السطر هو مفتاح الحل.
// يخبر Next.js أن يقوم بتوليد هذه الصفحة بشكل ثابت عند النشر،
// ثم يقوم بإعادة التحقق من وجود تحديثات في الخلفية كل ساعة (3600 ثانية).
// هذا سيخفض TTFB بشكل جذري لأن الصفحة ستكون جاهزة ومخزنة مسبقًا.
export const revalidate = 3600; // Revalidate every hour
// ========= END: PERFORMANCE OPTIMIZATION =========


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
        // تم تعديل padding top ليناسب التصميم العام بشكل أفضل
        <div className="pt-16 md:pt-20"> 
            <HeroSection />
            <AboutSection />
            {/* تم إضافة مكون الخدمات هنا لتظهر البيانات التي تم جلبها */}
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
