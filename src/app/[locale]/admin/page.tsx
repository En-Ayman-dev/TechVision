
"use client";

import { useAuth } from "@/hooks/use-auth";
import Login from "@/components/admin/Login";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}
