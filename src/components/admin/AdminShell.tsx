
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet"; // تم إضافة SheetHeader, SheetTitle, SheetDescription
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useTranslations } from "next-intl"; // تم إضافة استيراد useTranslations

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const t = useTranslations("Admin.shell"); // تم تهيئة دالة الترجمة

    return (
        <div className="flex min-h-screen">
            {/* القائمة الجانبية للكمبيوتر */}
            <AdminSidebar onMobile={false} />

            <main className="flex-1 p-4 md:p-8 bg-muted/40">
                {/* زر القائمة للهاتف */}
                <div className="md:hidden mb-4">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label={t("openMenu")}>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            {/* إضافة عنوان ووصف مخفيين للقارئات الشاشة */}
                            <SheetHeader>
                                <SheetTitle className="sr-only">{t("title")}</SheetTitle>
                                <SheetDescription className="sr-only">{t("description")}</SheetDescription>
                            </SheetHeader>
                            {/* القائمة الجانبية داخل النافذة المنبثقة للهاتف */}
                            <AdminSidebar onMobile={true} />
                        </SheetContent>
                    </Sheet>
                </div>

                {children}
            </main>
        </div>
    );
}
