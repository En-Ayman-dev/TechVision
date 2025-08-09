"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getThemeSettingsAction, updateThemeSettingsAction } from "@/app/actions";
import { useEffect, useState, useTransition } from "react";
import type { ThemeSettings } from "@/lib/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const hslColorRegex = /^(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%$/;
const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0% 0%";
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const hslToHex = (hsl: string) => {
    const match = hsl.match(/(\d+)\s*(\d+)%\s*(\d+)%/);
    if (!match) return "#000000";
    let h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return "#" + [0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('');
};


const themeSettingsSchema = z.object({
  light: z.object({
    background: z.string().regex(hslColorRegex, "Invalid HSL format"),
    primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
    accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
  }),
  dark: z.object({
    background: z.string().regex(hslColorRegex, "Invalid HSL format"),
    primary: z.string().regex(hslColorRegex, "Invalid HSL format"),
    accent: z.string().regex(hslColorRegex, "Invalid HSL format"),
  }),
});

function ColorPicker({ value, onChange }: { value: string, onChange: (value: string) => void }) {
    const hexValue = hslToHex(value);
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(hexToHsl(e.target.value));
    };

    return (
        <div className="flex items-center gap-2">
            <Input type="color" value={hexValue} onChange={handleHexChange} className="w-12 h-10 p-1" />
            <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="H S% L%" />
        </div>
    );
}


export default function ThemePage() {
  const [isPending, startTransition] = useTransition();
  const [isFetching, startFetchingTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations("Admin.themePage");
  const tGeneral = useTranslations("Admin.general");


  const form = useForm<z.infer<typeof themeSettingsSchema>>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
        light: { background: "0 0% 96.1%", primary: "217 89.1% 60.2%", accent: "195 100% 40%" },
        dark: { background: "224 71.4% 4.1%", primary: "217 89.1% 60.2%", accent: "195 100% 40%" }
    }
  });

  useEffect(() => {
    startFetchingTransition(async () => {
      const fetchedSettings = await getThemeSettingsAction();
      form.reset(fetchedSettings);
    });
  }, [form]);

  const handleSubmit = (values: z.infer<typeof themeSettingsSchema>) => {
    startTransition(async () => {
      const result = await updateThemeSettingsAction(values);
      if (result.success) {
        toast({
          title: tGeneral("itemUpdated", { item: t("item") }),
          description: tGeneral("itemUpdatedDesc", { item: t("item") }),
        });
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
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {isFetching ? (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-8">
               <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                  </div>
               </div>
               <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                  </div>
               </div>
            </CardContent>
        </Card>
      ) : (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Card>
            <CardHeader>
                <CardTitle>{t("themeTitle")}</CardTitle>
                <CardDescription>
                {t("themeDesc")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">{t("lightTheme")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Controller
                            name="light.background"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("background")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.light?.background && <p className="text-destructive text-sm">{form.formState.errors.light.background.message}</p>}
                                </div>
                            )}
                        />
                         <Controller
                            name="light.primary"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("primary")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.light?.primary && <p className="text-destructive text-sm">{form.formState.errors.light.primary.message}</p>}
                                </div>
                            )}
                        />
                         <Controller
                            name="light.accent"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("accent")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.light?.accent && <p className="text-destructive text-sm">{form.formState.errors.light.accent.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                </div>

                 <div>
                    <h3 className="text-lg font-medium mb-4">{t("darkTheme")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Controller
                            name="dark.background"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("background")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.dark?.background && <p className="text-destructive text-sm">{form.formState.errors.dark.background.message}</p>}
                                </div>
                            )}
                        />
                         <Controller
                            name="dark.primary"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("primary")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.dark?.primary && <p className="text-destructive text-sm">{form.formState.errors.dark.primary.message}</p>}
                                </div>
                            )}
                        />
                         <Controller
                            name="dark.accent"
                            control={form.control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                <Label>{t("accent")}</Label>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                                {form.formState.errors.dark?.accent && <p className="text-destructive text-sm">{form.formState.errors.dark.accent.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isPending} className="w-full" aria-label={tGeneral("saveChanges")}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {tGeneral("saveChanges")}
                </Button>
            </CardContent>
            </Card>
        </form>
      )}
    </div>
  );
}
