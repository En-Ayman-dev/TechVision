"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";
import { MainSidebar } from "./MainSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    <header className="fixed top-0 z-50 w-full border-b backdrop-blur-sm">
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
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
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