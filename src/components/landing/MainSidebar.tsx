import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

interface MainSidebarProps {
    locale: string;
    onClose: () => void;
}

export function MainSidebar({ locale, onClose }: MainSidebarProps) {
    const t = useTranslations("Header");
    const currentPathname = usePathname();

    const navItems = [
        { label: t("home"), href: "/" },
        { label: t("portfolio"), href: "/portfolio" },
        { label: t("services"), href: "/services" },
        { label: t("about"), href: "/about" },
        { label: t("BlogSystem"), href: "/blog" },
    ];

    return (
        <div className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-4">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "p-2 text-foreground/60 transition-colors hover:text-foreground",
                                currentPathname === item.href && "text-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Footer / Contact Button and Theme Toggle */}
            <div className="flex items-center justify-between p-4">
                <Link href="/contact" passHref>
                    <Button onClick={onClose}>{t("contact")}</Button>
                </Link>
                <ThemeToggle />
            </div>
        </div>
    );
}