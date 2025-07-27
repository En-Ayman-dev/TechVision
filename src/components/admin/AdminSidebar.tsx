
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  LogOut,
  Code,
  Sparkles,
  Star,
  Settings,
  Handshake,
  Palette,
  LayoutTemplate,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "next-intl";
import { ThemeToggle } from "../landing/ThemeToggle";

const navItems = [
  { href: "/ar/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ar/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/ar/admin/projects", icon: LayoutTemplate, label: "Projects" },
  { href: "/ar/admin/team", icon: Users, label: "Team" },
  { href: "/ar/admin/services", icon: Briefcase, label: "Services" },
  { href: "/ar/admin/testimonials", icon: Star, label: "Testimonials" },
  { href: "/ar/admin/partners", icon: Handshake, label: "Partners" },
  { href: "/ar/admin/settings", icon: Settings, label: "Site Settings" },
  { href: "/ar/admin/theme", icon: Palette, label: "Theme" },
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
