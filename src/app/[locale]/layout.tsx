// // src/app/[locale]/layout.tsx

// 'use client'

// import '/src/i18n';
//  // استيراد ملف i18n لتفعيل الترجمة
// import type { Metadata } from 'next';
// import '../globals.css';
// import { ThemeProvider } from '@/hooks/use-theme';
// import { Toaster } from "@/components/ui/toaster";
// import LoadingScreen from '@/components/landing/LoadingScreen';
// import WelcomeNotification from '@/components/landing/WelcomeNotification';

// // i18n additions
// import { dir } from 'i18next';
// import { createInstance } from 'i18next';
// import { initReactI18next } from 'react-i18next/initReactI18next';
// import i18nextHttpBackend from 'i18next-http-backend';
// import { I18nextProvider } from 'react-i18next';

// import { Inter, Space_Grotesk } from 'next/font/google'
// import Script from 'next/script';

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

// const spaceGrotesk = Space_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-space-grotesk',
// })

// type Props = {
//   params: { locale: string };
// };

// async function initTranslations(locale: string, ns: string[]) {
//   const i18nInstance = createInstance();

//   await i18nInstance
//     .use(initReactI18next)
//     .use(i18nextHttpBackend)
//     .init({
//       lng: locale,
//       ns,
//       defaultNS: 'common',
//       fallbackLng: 'en',
//       backend: {
//         loadPath: '/locales/{{lng}}/{{ns}}.json',
//       },
//     });

//   return { i18n: i18nInstance, t: i18nInstance.t };
// }

// export async function generateMetadata(props: Props): Promise<Metadata> {
//   const { locale } = props.params;
//   const { t } = await initTranslations(locale, ['Metadata']);
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

//   return {
//     title: t('title'),
//     description: t('description'),
//     keywords: t('keywords').split(', '),
//     authors: [{ name: 'TechVision', url: baseUrl }],
//     creator: 'TechVision',
//     publisher: 'TechVision',
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         'max-video-preview': -1,
//         'max-image-preview': 'large',
//         'max-snippet': -1,
//       },
//     },
//     alternates: {
//       canonical: `${baseUrl}/${locale}`,
//       languages: {
//         'en-US': `${baseUrl}/en`,
//         'ar-AE': `${baseUrl}/ar`,
//       },
//     },
//     openGraph: {
//       title: t('title'),
//       description: t('description'),
//       url: `${baseUrl}/${locale}`,
//       siteName: 'TechVision',
//       images: [
//         {
//           url: `${baseUrl}/og-image.png`,
//           width: 1200,
//           height: 630,
//           alt: 'TechVision Logo',
//         },
//       ],
//       locale: locale,
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: t('title'),
//       description: t('description'),
//       images: [`${baseUrl}/og-image.png`],
//     },
//   };
// }

// export default async function LocaleLayout(
//   props: Readonly<{
//     children: React.ReactNode;
//     params: { locale: string };
//   }>
// ) {
//   const { children } = props;
//   const { locale } = props.params;

//   const { i18n } = await initTranslations(locale, [
//     'common',
//     'Header',
//     'HeroSection',
//     'Footer',
//     'PartnersSection',
//     'AboutSection',
//     'ServicesSection',
//     'WhyChooseUsSection',
//     'PortfolioSection',
//     'TeamSection',
//     'TestimonialsSection',
//     'FaqSection',
//     'CtaSection',
//     'ContactSection',
//     'LoadingScreen',
//     'WelcomeNotification'
//   ]);

//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "name": "TechVision",
//     "url": baseUrl,
//     "logo": `${baseUrl}/logo.png`,
//     "contactPoint": {
//       "@type": "ContactPoint",
//       "telephone": "+1-555-555-5555",
//       "contactType": "customer service"
//     }
//   };

//   return (
//     <html lang={locale} dir={dir(locale)} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
//       <head>
//         <Script
//           id="structured-data-script"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />
//       </head>
//       <body className="font-body antialiased">
//         <I18nextProvider i18n={i18n}>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             <>
//               <LoadingScreen />
//               {children}
//               <Toaster />
//               <WelcomeNotification />
//             </>
//           </ThemeProvider>
//         </I18nextProvider>
//       </body>
//     </html>
//   );
// }


// src/app/[locale]/layout.tsx
import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from '@/components/landing/LoadingScreen';
import WelcomeNotification from '@/components/landing/WelcomeNotification';

// استيراد dir من i18next لتعيين اتجاه النص
import { dir } from 'i18next';

// استيراد الدوال اللازمة لجلب الترجمات في Server Components (لا يزال مطلوبًا لـ Metadata)
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18nextHttpBackend from 'i18next-http-backend';

// استيراد المكون الجديد I18nProviderClient
import I18nProviderClient from '@/components/I18nProviderClient';

import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

type Props = {
  params: { locale: string };
};

// دالة مساعدة لتهيئة i18n وجلب الترجمات على الخادم (تستخدم لـ Metadata فقط الآن)
async function initTranslations(locale: string, ns: string[]) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(i18nextHttpBackend)
    .init({
      lng: locale,
      ns,
      defaultNS: 'common',
      fallbackLng: 'en',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });

  return { i18n: i18nInstance, t: i18nInstance.t };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  
  const { t } = await initTranslations(locale, ['Metadata']); // لا يزال يستخدم initTranslations
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
    authors: [{ name: 'TechVision', url: baseUrl }],
    creator: 'TechVision',
    publisher: 'TechVision',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'ar-AE': `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'TechVision',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TechVision Logo',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function LocaleLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const { children } = props;
  const { locale } = await props.params;

  // لا نقوم بتهيئة i18n هنا بعد الآن، بل نمرر locale إلى I18nProviderClient

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechVision",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555",
      "contactType": "customer service"
    }
  };

  return (
    // تأكد من عدم وجود مسافات بيضاء هنا
    <html lang={locale} dir={dir(locale)} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="structured-data-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased">
        {/* تغليف بـ I18nProviderClient وتمرير locale إليه */}
        <I18nProviderClient locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingScreen />
            {children}
            <Toaster />
            <WelcomeNotification />
          </ThemeProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}
