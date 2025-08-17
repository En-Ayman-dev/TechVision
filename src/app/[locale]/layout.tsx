
// import type { Metadata } from 'next';
// import { getLocale, getMessages, getTranslations } from 'next-intl/server';

// import { NextIntlClientProvider } from 'next-intl';
// import { Inter, Space_Grotesk } from 'next/font/google';
// import Script from 'next/script';
// import { Toaster } from "@/components/ui/toaster";
// import LoadingScreen from '@/components/landing/LoadingScreen';
// import WelcomeNotification from '@/components/landing/WelcomeNotification';
// import { ThemeProvider } from '@/hooks/use-theme';
// import { NotificationProvider } from '@/components/ui/notification';
// import { AccessibilityProvider, AccessibilityToolbar, SkipToContent } from '@/components/ui/accessibility';
// import { PerformanceMonitor } from '@/components/ui/performance-monitor';
// import { PWAInstallPrompt } from '@/components/ui/pwa-install';
// import '../globals.css';
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// });

// const spaceGrotesk = Space_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-space-grotesk',
// });

// type Props = {
//   params: { locale: string };
// };

// // export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
// //   const t = await getTranslations({ locale, namespace: 'Metadata' });
// //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
// export async function generateMetadata(): Promise<Metadata> {
//   const locale = await getLocale();
//   const t = await getTranslations({ locale, namespace: 'Metadata' });
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tech-vision-ayman.vercel.app';
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
//     metadataBase: new URL(baseUrl),


//     alternates: {
//       canonical: `/${locale}`,
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

// export default async function LocaleLayout({
//   children,
//   params
// }: {
//   children: React.ReactNode;
//   params: { locale: string }
// }) {
//   const locale = await getLocale();
//   const messages = await getMessages();
//   const dir = locale === 'ar' ? 'rtl' : 'ltr';

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
//     <html lang={locale} dir={dir} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#000000" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-title" content="TechVision" />
//         <link rel="apple-touch-icon" href="/image/icons/android-chrome-192x192.png" />
//         <link rel="preload" href="/image/About.avif" as="image" />

//         <Script
//           id="structured-data-script"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />
//       </head>
//       <body className="font-body antialiased">
//         <SkipToContent />
//         <NextIntlClientProvider messages={messages}>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             <AccessibilityProvider>
//               <NotificationProvider>
//                 <LoadingScreen />
//                 <main id="main-content">
//                   {children}
//                 </main>
//                 <Toaster />
//                 <WelcomeNotification />
//                 <AccessibilityToolbar />
//                 <PerformanceMonitor />
//                 <PWAInstallPrompt />
//               </NotificationProvider>
//             </AccessibilityProvider>
//           </ThemeProvider>
//         </NextIntlClientProvider>
//         <Analytics />
//         <SpeedInsights />
//       </body>
//     </html>
//   );
// }


"use server";

import type { Metadata } from 'next';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { NextIntlClientProvider } from 'next-intl';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from '@/components/landing/LoadingScreen';
import WelcomeNotification from '@/components/landing/WelcomeNotification';
import { ThemeProvider } from '@/hooks/use-theme';
import { NotificationProvider } from '@/components/ui/notification';
import { AccessibilityProvider, AccessibilityToolbar, SkipToContent } from '@/components/ui/accessibility';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { PWAInstallPrompt } from '@/components/ui/pwa-install';
import '../globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

type Props = {
  params: { locale: string };
};

// export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
//   const t = await getTranslations({ locale, namespace: 'Metadata' });
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tech-vision-ayman.vercel.app';
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
    metadataBase: new URL(baseUrl),


    alternates: {
      canonical: `/${locale}`,
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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string }
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "TechVision",
        "url": baseUrl,
        "logo": `${baseUrl}/image/logo.svg`,
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "name": "TechVision",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/${locale}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="TechVision" />
        <link rel="android-chrome" href="/image/icons/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" href="/image/icons/apple-touch-icon.png" />
        <link rel="preload" href="/image/About.avif" as="image" />
        <Script
          id="structured-data-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased">
        <SkipToContent />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AccessibilityProvider>
              <NotificationProvider>
                <LoadingScreen />
                <main id="main-content">
                  {children}
                </main>
                <Toaster />
                <WelcomeNotification />
                <AccessibilityToolbar />
                <PerformanceMonitor />
                <PWAInstallPrompt />
              </NotificationProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}