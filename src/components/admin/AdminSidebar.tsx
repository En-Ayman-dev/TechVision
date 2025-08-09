
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  LogOut,
  Code,
  Star,
  Settings,
  Handshake,
  Palette,
  LayoutTemplate,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocale, useTranslations } from "next-intl";
import { ThemeToggle } from "../landing/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "Dashboard" },
  { href: "/admin/messages", icon: MessageSquare, labelKey: "Messages" },
  { href: "/admin/projects", icon: LayoutTemplate, labelKey: "Projects" },
  { href: "/admin/team", icon: Users, labelKey: "Team" },
  { href: "/admin/services", icon: Briefcase, labelKey: "Services" },
  { href: "/admin/blog", icon: FileText, labelKey: "Blog" },
  { href: "/admin/testimonials", icon: Star, labelKey: "Testimonials" },
  { href: "/admin/partners", icon: Handshake, labelKey: "Partners" },
  { href: "/admin/settings", icon: Settings, labelKey: "Site Settings" },
  { href: "/admin/theme", icon: Palette, labelKey: "Theme" },
];

interface AdminSidebarProps {
  onMobile: boolean;
}

export default function AdminSidebar({ onMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const locale = useLocale();
  const t = useTranslations('Admin');
  const isRTL = locale === 'ar';

  return (
    <aside
      className={cn(
        "w-64 flex-shrink-0 bg-background border-r flex flex-col",
        {
          "hidden md:flex": !onMobile,
        }
      )}
    >
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
              key={item.labelKey}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
              aria-label={t(item.labelKey)}
            >
              <Link href={`/${locale}${item.href}`}>
                <item.icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t(item.labelKey)}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <ThemeToggle />
        <Button variant="outline" className="w-full mt-4" onClick={logout} aria-label={t('logout')}>
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
}