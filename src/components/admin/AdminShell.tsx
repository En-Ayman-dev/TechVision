
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 bg-muted/40">
                {children}
            </main>
        </div>
    );
}
