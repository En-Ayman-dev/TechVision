"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlignRight, Search, Globe } from "lucide-react";
import { MainSidebar } from "./MainSidebar";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Added DialogTitle
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the LanguageToggle component
const LanguageToggle = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    // This logic handles a common pattern for i18n routing,
    // where the locale is a prefix of the URL.
    const pathWithoutLocale = pathname.startsWith(`/${locale}`)
      ? pathname.substring(`/${locale}`.length)
      : pathname;
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Header({
  lang,
  pathname,
}: {
  lang: string;
  pathname: string;
}) {
  const t = useTranslations("Header");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const currentPathname = usePathname();

  return (
<header className="fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 items-center">
        {/* Logo and Mobile Sidebar Trigger */}
        <div className="flex w-full items-center justify-between lg:w-auto lg:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/image/logo.svg"
              alt="TechVision Logo"
              width={120}
              height={32}
            />
          </Link>
          {/* Mobile Menu and other buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden">
                  <AlignRight />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>{t("menu")}</SheetTitle>
                </SheetHeader>
                <MainSidebar locale={lang} onClose={() => setIsSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden w-full items-center justify-between lg:flex">
          <div className="mx-auto flex gap-6">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                currentPathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t("home")}
            </Link>
            <Link
              href="/portfolio"
              className={cn(
                "transition-colors hover:text-foreground/80",
                currentPathname === "/portfolio" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t("portfolio")}
            </Link>
            <Link
              href="/services"
              className={cn(
                "transition-colors hover:text-foreground/80",
                currentPathname === "/services" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t("services")}
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                currentPathname === "/about" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t("about")}
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors hover:text-foreground/80",
                currentPathname === "/blog" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t("BlogSystem")}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/contact" passHref>
              <Button>{t("contact")}</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;