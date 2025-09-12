// src/components/admin/ContactMethodForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { ContactMethod, ContactMethodInputType } from "@/lib/types";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { addContactMethodAction, updateContactMethodAction } from "@/app/admin.actions";

// Schema for form validation, matching the one in admin.actions.ts
const contactMethodSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    label_en: z.string().min(2, "English label is required."),
    label_ar: z.string().min(2, "Arabic label is required."),
    placeholder_en: z.string().min(2, "English placeholder is required."),
    placeholder_ar: z.string().min(2, "Arabic placeholder is required."),
    inputType: z.enum(['text', 'tel', 'email', 'url']),
    icon: z.string().optional(),
});

type ContactMethodFormData = z.infer<typeof contactMethodSchema>;

interface Props {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormSubmit: () => void; // To refetch data after submission
    initialData?: ContactMethod | null;
}

export function ContactMethodForm({ isOpen, onOpenChange, onFormSubmit, initialData }: Props) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const t = useTranslations("Admin.settingsPage.contactMethods");
    const tGeneral = useTranslations("Admin.general");

    const form = useForm<ContactMethodFormData>({
        resolver: zodResolver(contactMethodSchema),
        defaultValues: initialData || {
            name: "",
            label_en: "",
            label_ar: "",
            placeholder_en: "",
            placeholder_ar: "",
            inputType: "text",
            icon: "",
        },
    });

    // Reset form when initialData changes (e.g., when opening for editing)
    // But only if the form is not already dirty
    if (!form.formState.isDirty && form.getValues().id !== initialData?.id) {
        form.reset(initialData || { name: "", label_en: "", label_ar: "", placeholder_en: "", placeholder_ar: "", inputType: "text", icon: "" });
    }

    const handleSubmit = (values: ContactMethodFormData) => {
        const formData = new FormData();
        // Append all form values to FormData
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        startTransition(async () => {
            const action = initialData ? updateContactMethodAction : addContactMethodAction;
            const result = await action(formData);

            if (result.success) {
                toast({
                    title: initialData ? tGeneral("itemUpdated", { item: t("item") }) : tGeneral("itemAdded", { item: t("item") }),
                });
                onFormSubmit(); // Callback to refresh the list
                onOpenChange(false); // Close the dialog
            } else {
                toast({
                    title: tGeneral("error"),
                    description: result.message,
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? t("editTitle") : t("addTitle")}</DialogTitle>
                    <DialogDescription>{initialData ? t("editDesc") : t("addDesc")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name (Slug) */}
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("fieldName")}</Label>
                            <Input id="name" {...form.register("name")} />
                            {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
                        </div>
                        {/* Icon */}
                        <div className="space-y-2">
                            <Label htmlFor="icon">{t("fieldIcon")}</Label>
                            <Input id="icon" {...form.register("icon")} placeholder="e.g., 'Mail', 'Phone'" />
                            <p className="text-xs text-muted-foreground">{t('fieldIconHint')}</p>
                        </div>
                        {/* English Label */}
                        <div className="space-y-2">
                            <Label htmlFor="label_en">{t("fieldLabelEn")}</Label>
                            <Input id="label_en" {...form.register("label_en")} />
                            {form.formState.errors.label_en && <p className="text-destructive text-sm">{form.formState.errors.label_en.message}</p>}
                        </div>
                        {/* Arabic Label */}
                        <div className="space-y-2">
                            <Label htmlFor="label_ar">{t("fieldLabelAr")}</Label>
                            <Input id="label_ar" {...form.register("label_ar")} dir="rtl" />
                            {form.formState.errors.label_ar && <p className="text-destructive text-sm">{form.formState.errors.label_ar.message}</p>}
                        </div>
                        {/* English Placeholder */}
                        <div className="space-y-2">
                            <Label htmlFor="placeholder_en">{t("fieldPlaceholderEn")}</Label>
                            <Input id="placeholder_en" {...form.register("placeholder_en")} />
                            {form.formState.errors.placeholder_en && <p className="text-destructive text-sm">{form.formState.errors.placeholder_en.message}</p>}
                        </div>
                        {/* Arabic Placeholder */}
                        <div className="space-y-2">
                            <Label htmlFor="placeholder_ar">{t("fieldPlaceholderAr")}</Label>
                            <Input id="placeholder_ar" {...form.register("placeholder_ar")} dir="rtl" />
                            {form.formState.errors.placeholder_ar && <p className="text-destructive text-sm">{form.formState.errors.placeholder_ar.message}</p>}
                        </div>
                        {/* Input Type */}
                        <div className="space-y-2">
                            <Label htmlFor="inputType">{t("fieldInputType")}</Label>
                            <Select onValueChange={(value) => form.setValue('inputType', value as ContactMethodInputType)} defaultValue={form.getValues('inputType')}>
                                <SelectTrigger id="inputType">
                                    <SelectValue placeholder={t('inputTypePlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="tel">Telephone (tel)</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="url">URL</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.inputType && <p className="text-destructive text-sm">{form.formState.errors.inputType.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">{tGeneral("cancel")}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {tGeneral("saveChanges")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}