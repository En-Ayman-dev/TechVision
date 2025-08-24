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

interface Props {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
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
          <main className="min-h-screen">
            {children}
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