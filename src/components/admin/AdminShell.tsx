
"use client";

import { useAuth } from "@/hooks/use-auth";
import Login from "@/components/admin/Login";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
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
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 bg-muted/40">
                {children}
            </main>
        </div>
    );
}
