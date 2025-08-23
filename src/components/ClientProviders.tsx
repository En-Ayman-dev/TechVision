'use client';

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/hooks/use-theme";
import { AccessibilityProvider } from "@/components/ui/accessibility";
import { NotificationProvider } from "@/components/ui/notification";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

type Props = {
    children: ReactNode;
    messages: any;
    // إضافة prop للغة
    locale: string;
};

export function ClientProviders({ children, messages, locale }: Props) {
    return (
        // تمرير locale صراحة
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AccessibilityProvider>
                    <NotificationProvider>
                        {children}
                        <Toaster />
                    </NotificationProvider>
                </AccessibilityProvider>
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
        </NextIntlClientProvider>
    );
}