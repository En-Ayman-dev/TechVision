"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/ui/notification";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ThemeProvider } from "next-themes";
import { AccessibilityProvider, AccessibilityToolbar } from "@/components/ui/accessibility"; // تم إضافة هذا السطر
import { AbstractIntlMessages } from "next-intl"; // تم إضافة هذا السطر

interface Props {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages; // تم تعديل هذا السطر
}

export default function I18nProviderClient({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          <Header lang={locale} pathname="/" />
          <main className="min-h-screen pt-16"> {/* تم إضافة pt-16 هنا */}
            <AccessibilityProvider> {/* تم إضافة هذا السطر */}
              {children}
              <AccessibilityToolbar /> {/* تم إضافة هذا السطر */}
            </AccessibilityProvider> {/* تم إضافة هذا السطر */}
          </main>
          <Footer />
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </NotificationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}