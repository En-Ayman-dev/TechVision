"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/ui/notification";
import { ThemeProvider } from "next-themes";

interface Props {
    children: ReactNode;
    locale: string;
}

export default function ClientProviders({ children, locale }: Props) {
    return (
        <NextIntlClientProvider locale={locale}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NotificationProvider>
                    {children}
                    <Toaster />
                    <SpeedInsights />
                    <Analytics />
                </NotificationProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}