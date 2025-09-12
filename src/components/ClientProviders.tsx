// src/components/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/components/ui/notification";
import { ThemeProvider } from "next-themes";
import { AccessibilityProvider, FloatingActionGroup } from "@/components/ui/accessibility"; // <-- تغيير هنا
import { AbstractIntlMessages } from "next-intl"; // تم إضافة هذا السطر

interface Props {
    children: ReactNode;
    locale: string;
    messages: AbstractIntlMessages; // تم إضافة هذا السطر
}

export default function ClientProviders({ children, locale, messages }: Props) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}> {/* تم إضافة الخاصية messages هنا */}
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NotificationProvider>
                    <AccessibilityProvider>
                        {children}
                        <Toaster />
                        <SpeedInsights />
                        <Analytics />
                        <FloatingActionGroup />
                    </AccessibilityProvider>
                </NotificationProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}