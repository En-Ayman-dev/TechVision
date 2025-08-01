"use client";

import "../../globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import AdminShell from "@/components/admin/AdminShell";
import Login from "@/components/admin/Login";
import { NextIntlClientProvider, useMessages } from 'next-intl';

function AdminAuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}

export default function AdminLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
    const messages = useMessages();
  return (
    <div className="admin-dashboard-layout">
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                <AdminAuthenticatedLayout>
                    {children}
                </AdminAuthenticatedLayout>
                <Toaster />
                </AuthProvider>
            </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
