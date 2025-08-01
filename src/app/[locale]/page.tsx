// src/app/[locale]/page.tsx
import dynamic from 'next/dynamic';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/landing/Footer';
import { Skeleton } from '@/components/ui/skeleton';

// استيراد الدوال اللازمة لجلب الترجمات في Server Components
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
// استيراد i18nextHttpBackend بدلاً من resourcesToBackend
import i18nextHttpBackend from 'i18next-http-backend';

// استيراد المكونات الأخرى التي تظهر في الصفحة
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import CtaSection from '@/components/landing/CtaSection';
import FaqSection from '@/components/landing/FaqSection';
import PartnersSection from '@/components/landing/PartnersSection';
import PortfolioSection from '@/components/landing/PortfolioSection';
import ServicesSection from '@/components/landing/ServicesSection';
import TeamSection from '@/components/landing/TeamSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import WhyChooseUsSection from '@/components/landing/WhyChooseUsSection';

// دالة لتهيئة i18n وجلب الترجمات على الخادم
async function initTranslations(locale: string, ns: string[]) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    // استخدام i18nextHttpBackend لجلب الموارد
    .use(i18nextHttpBackend)
    .init({
      lng: locale,
      ns,
      defaultNS: 'common',
      fallbackLng: 'en',
      backend: {
        // تحديد المسار الذي سيجلب منه i18nextHttpBackend ملفات الترجمة
        // هذا المسار هو المسار الذي يمكن للمتصفح الوصول إليه
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });

  return { i18n: i18nInstance, t: i18nInstance.t };
}

export default async function Home({ params }: { params: { locale: string } }) {
  // await params قبل الوصول إلى locale
  const { locale } = await params;

  // جلب الترجمات باستخدام initTranslations
  // قم بجلب جميع namespaces التي تستخدمها هذه الصفحة أو المكونات الفرعية
  const { t } = await initTranslations(locale, [
    'common', // namespace افتراضي
    'Header', 'HeroSection', 'Footer', 'PartnersSection', 'AboutSection',
    'ServicesSection', 'WhyChooseUsSection', 'PortfolioSection', 'TeamSection',
    'TestimonialsSection', 'FaqSection', 'CtaSection', 'ContactSection'
  ]);

  return (
    <>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <PartnersSection t={t} />
          <AboutSection t={t} />
          <ServicesSection t={t} />
          <WhyChooseUsSection t={t} />
          <PortfolioSection />
          <TeamSection t={t} />
          <TestimonialsSection t={t} />
          <FaqSection t={t} />
          <CtaSection t={t} />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
