// i18n.js (في جذر مشروعك أو src/)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // سيتم تحديث هذا ديناميكيًا بواسطة Next.js
    interpolation: {
      escapeValue: false, // React بالفعل يقوم بذلك
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // قائمة بجميع الـ namespaces التي تستخدمها في مشروعك
    ns: ['common', 'Header', 'HeroSection', 'Footer', 'PartnersSection', 'AboutSection', 'ServicesSection', 'WhyChooseUsSection', 'PortfolioSection', 'TeamSection', 'TestimonialsSection', 'FaqSection', 'CtaSection', 'ContactSection', 'LoadingScreen', 'WelcomeNotification', 'Metadata'],
    defaultNS: 'common',
    react: {
      useSuspense: false, // أو true إذا كنت تستخدم Suspense
    },
  });

export default i18n;