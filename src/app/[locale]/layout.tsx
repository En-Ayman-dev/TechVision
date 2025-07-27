import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from "@/components/ui/toaster";
import LoadingScreen from '@/components/landing/LoadingScreen';
import WelcomeNotification from '@/components/landing/WelcomeNotification';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { Inter, Space_Grotesk } from 'next/font/google'

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
  params: {locale: string};
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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

export default async function LocaleLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
