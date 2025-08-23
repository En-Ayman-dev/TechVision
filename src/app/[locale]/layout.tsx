import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';
import  Header  from "@/components/landing/Header";
import  Footer  from "@/components/landing/Footer";
import LoadingScreen from '@/components/landing/LoadingScreen';
import WelcomeNotification from '@/components/landing/WelcomeNotification';
import { AccessibilityToolbar, SkipToContent } from '@/components/ui/accessibility';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { PWAInstallPrompt } from '@/components/ui/pwa-install';
import { MainSidebar } from "@/components/landing/MainSidebar";
import { ClientProviders } from "@/components/ClientProviders";

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

const locales = ["en", "ar"];

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tech-vision-ayman.vercel.app';
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    authors: [{ name: "TechVision", url: baseUrl }],
    creator: "TechVision",
    publisher: "TechVision",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "ar-AE": `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "TechVision",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "TechVision Logo",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale as any)) notFound();

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
        <ClientProviders messages={messages} locale={locale}>
          <Header />
          <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
              <MainSidebar />
            </aside>
            <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
              {children}
            </main>
          </div>
          <Footer />
          <LoadingScreen />
          <WelcomeNotification />
          <AccessibilityToolbar />
          <PerformanceMonitor />
          <PWAInstallPrompt />
        </ClientProviders>
      </body>
    </html>
  );
}