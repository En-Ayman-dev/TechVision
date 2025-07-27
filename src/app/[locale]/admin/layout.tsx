
"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShell from "@/components/admin/AdminShell";
import Login from "@/components/admin/Login";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Admin Dashboard",
//   description: "Manage your website content.",
// };

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
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
