
'use client';

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function MainSidebar() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const pathname = usePathname();

    const sidebarLinks = [
        {
            title: t("home"),
            href: `/${locale}`,
        },
        {
            title: t("services"),
            href: `/${locale}/services`,
        },
        {
            title: t("portfolio"),
            href: `/${locale}/portfolio`,
        },
        {
            title: t("about"),
            href: `/${locale}/about`,
        },
        {
            title: t("Faq"),
            href: `/${locale}/faq`,
        },
        {
            title: t("contact"),
            href: `/${locale}/contact`,
        },
    ];

    return (
        <nav className="flex flex-col gap-2 p-4 pt-0">
            <h2 className="text-xl font-bold tracking-tight">{t("sidebar")}</h2>
            <Separator className="mb-2" />
            {sidebarLinks.map((link) => (
                <Link
                    key={link.title}
                    href={link.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === link.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start text-lg"
                    )}
                >
                    {link.title}
                </Link>
            ))}
        </nav>
    );
}