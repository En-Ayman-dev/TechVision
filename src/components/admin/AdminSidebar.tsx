
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  LogOut,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../landing/ThemeToggle";
import { useLocale } from "next-intl";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/projects", icon: Briefcase, label: "Projects" },
  { href: "/admin/team", icon: Users, label: "Team" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const locale = useLocale();

  return (
    <aside className="w-64 flex-shrink-0 bg-background border-r hidden md:flex flex-col">
      <div className="flex items-center justify-center h-20 border-b gap-2">
        <Code className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg font-headline">TechVision</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const itemPath = `/${locale}${item.href}`;
          const isActive = pathname === itemPath;
          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <ThemeToggle />
        <Button variant="outline" className="w-full mt-4" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
