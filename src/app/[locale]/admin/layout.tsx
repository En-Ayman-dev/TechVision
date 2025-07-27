
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShell from "@/components/admin/AdminShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your website content.",
};

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
        <AdminShell>
          {children}
        </AdminShell>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
