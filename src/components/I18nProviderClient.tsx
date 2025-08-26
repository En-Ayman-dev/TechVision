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
import { AccessibilityProvider, AccessibilityToolbar } from "@/components/ui/accessibility";
import { AbstractIntlMessages } from "next-intl";

interface Props {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
  now?: Date;
}

export default function I18nProviderClient({ children, locale, messages, timeZone = "Asia/Riyadh", now = new Date() }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone} now={now}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          <Header lang={locale} pathname="/" />
          <main className="min-h-screen pt-16">
            <AccessibilityProvider>
              {children}
              <AccessibilityToolbar />
            </AccessibilityProvider>
          </main>
          <Toaster />
          <Footer />
          <SpeedInsights />
          <Analytics />
        </NotificationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
