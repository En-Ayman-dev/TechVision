"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Service } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { addServiceAction, updateServiceAction, generateFullServiceAction } from "@/app/actions"; // 1. Import AI action
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: Service | null;
  onSubmit: () => void;
}

// Zod Schema matching the new bilingual structure from actions.ts
const bilingualContentSchema = z.object({
  en: z.string().min(1, "English content is required."),
  ar: z.string().min(1, "Arabic content is required."),
});

const serviceFeatureSchema = z.object({
  title: bilingualContentSchema,
  description: bilingualContentSchema,
  icon: z.string().min(1, "Feature icon is required."),
});

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, "Icon is required."),
  title: bilingualContentSchema,
  description: bilingualContentSchema,
  detailedContent: bilingualContentSchema,
  heroImage: z.string().url("Invalid URL.").optional().or(z.literal('')),
  features: z.array(serviceFeatureSchema).optional(),
});

const iconOptions = ["Code", "Cloud", "PenTool", "Database", "Shield", "LineChart"];

export function ServiceForm({ isOpen, onOpenChange, service, onSubmit }: ServiceFormProps) {
  const t = useTranslations('Admin.servicesPage');
  const tg = useTranslations('Admin.general');
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  const [aiServiceTitle, setAiServiceTitle] = useState("");

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      icon: "Code",
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      detailedContent: { en: "", ar: "" },
      heroImage: "",
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const { formState: { errors } } = form;
  const hasEnglishErrors = !!(errors.title?.en || errors.description?.en || errors.detailedContent?.en || Array.isArray(errors.features) && errors.features.some(f => f?.title?.en || f?.description?.en));
  const hasArabicErrors = !!(errors.title?.ar || errors.description?.ar || errors.detailedContent?.ar || Array.isArray(errors.features) && errors.features.some(f => f?.title?.ar || f?.description?.ar));

  useEffect(() => {
    if (isOpen) {
      setActiveTab(service ? "manual" : "ai"); // Default to AI tab for new services
      if (service) {
        form.reset(service);
      } else {
        form.reset({
          icon: "Code", title: { en: "", ar: "" }, description: { en: "", ar: "" },
          detailedContent: { en: "", ar: "" }, heroImage: "", features: [],
        });
      }
    }
  }, [service, form, isOpen]);

  const handleGenerate = () => {
    if (!aiServiceTitle) {
      toast({ title: t('ai.titleRequired'), variant: "destructive" });
      return;
    }
    startGeneratingTransition(async () => {
      const result = await generateFullServiceAction(aiServiceTitle);
      if (result.success && result.data) {
        const { title, description, detailedContent, features } = result.data;
        form.setValue("title", title);
        form.setValue("description", description);
        form.setValue("detailedContent", detailedContent);
        form.setValue("features", features);
        toast({ title: t('ai.successTitle'), description: t('ai.successDesc') });
        setActiveTab("manual");
      } else {
        toast({ title: tg('error'), description: result.message, variant: "destructive" });
      }
    });
  };

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    startTransition(async () => {
      const action = service ? updateServiceAction : addServiceAction;
      const result = await action({ ...values, id: service?.id });
      if (result.success) {
        toast({ title: service ? t('serviceUpdated') : t('serviceAdded'), description: result.message });
        onSubmit();
      } else {
        const errorMessage = result.errors ? JSON.stringify(result.errors) : result.message;
        toast({ title: tg('error'), description: errorMessage, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{service ? t('editService') : t('addService')}</DialogTitle>
          <DialogDescription>{service ? t('editServiceDescription') : t('addServiceDescription')}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              {t('tabs.manual')} {(hasEnglishErrors || hasArabicErrors) && <span className="h-2 w-2 rounded-full bg-red-500" />}
            </TabsTrigger>
            <TabsTrigger value="ai">{t('tabs.ai')}</TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <div className="space-y-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="ai-service-title">{t('ai.titleLabel')}</Label>
                <Input id="ai-service-title" value={aiServiceTitle} onChange={(e) => setAiServiceTitle(e.target.value)} placeholder={t('ai.titlePlaceholder')} />
                <p className="text-sm text-muted-foreground">{t('ai.titleHint')}</p>
              </div>
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {t('ai.generateButton')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <form onSubmit={form.handleSubmit(handleSubmit, (errors) => console.error("Validation errors:", errors))} className="space-y-6">
              <div className="max-h-[60vh] overflow-y-auto pr-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="icon">{tg('icon')}</Label>
                    <Controller control={form.control} name="icon" render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger>
                        <SelectContent>{iconOptions.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                    {errors.icon && <p className="text-destructive text-sm">{errors.icon.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="heroImage">{t('heroImage')}</Label>
                    <Input id="heroImage" {...form.register("heroImage")} placeholder="https://example.com/image.png" />
                    {errors.heroImage && <p className="text-destructive text-sm">{errors.heroImage.message}</p>}
                  </div>
                </div>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en" className="flex items-center gap-2">English {hasEnglishErrors && <span className="h-2 w-2 rounded-full bg-red-500" />}</TabsTrigger>
                    <TabsTrigger value="ar" className="flex items-center gap-2">العربية {hasArabicErrors && <span className="h-2 w-2 rounded-full bg-red-500" />}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="space-y-4 pt-4">
                    <div className="grid gap-2"><Label>Title</Label><Input {...form.register("title.en")} />{errors.title?.en && <p className="text-destructive text-sm">{errors.title.en.message}</p>}</div>
                    <div className="grid gap-2"><Label>Short Description</Label><Textarea {...form.register("description.en")} />{errors.description?.en && <p className="text-destructive text-sm">{errors.description.en.message}</p>}</div>
                    <div className="grid gap-2"><Label>Detailed Content (HTML)</Label><Textarea {...form.register("detailedContent.en")} rows={8} />{errors.detailedContent?.en && <p className="text-destructive text-sm">{errors.detailedContent.en.message}</p>}</div>
                  </TabsContent>
                  <TabsContent value="ar" className="space-y-4 pt-4">
                    <div className="grid gap-2"><Label>العنوان</Label><Input dir="rtl" {...form.register("title.ar")} />{errors.title?.ar && <p className="text-destructive text-sm">{errors.title.ar.message}</p>}</div>
                    <div className="grid gap-2"><Label>الوصف المختصر</Label><Textarea dir="rtl" {...form.register("description.ar")} />{errors.description?.ar && <p className="text-destructive text-sm">{errors.description.ar.message}</p>}</div>
                    <div className="grid gap-2"><Label>المحتوى التفصيلي</Label><Textarea dir="rtl" {...form.register("detailedContent.ar")} rows={8} />{errors.detailedContent?.ar && <p className="text-destructive text-sm">{errors.detailedContent.ar.message}</p>}</div>
                  </TabsContent>
                </Tabs>
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t('features')}</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-lg space-y-4 relative">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid gap-2"><Label>Feature Icon</Label><Input {...form.register(`features.${index}.icon`)} placeholder="e.g., CheckCircle2" />{errors.features?.[index]?.icon && <p className="text-destructive text-sm">{errors.features[index]?.icon?.message}</p>}</div>
                      <Tabs defaultValue="en_feature" className="w-full">
                        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="en_feature">English</TabsTrigger><TabsTrigger value="ar_feature">Arabic</TabsTrigger></TabsList>
                        <TabsContent value="en_feature" className="space-y-2 pt-2">
                          <div className="grid gap-2"><Label>Title</Label><Input {...form.register(`features.${index}.title.en`)} />{errors.features?.[index]?.title?.en && <p className="text-destructive text-sm">{errors.features[index]?.title?.en?.message}</p>}</div>
                          <div className="grid gap-2"><Label>Description</Label><Textarea {...form.register(`features.${index}.description.en`)} />{errors.features?.[index]?.description?.en && <p className="text-destructive text-sm">{errors.features[index]?.description?.en?.message}</p>}</div>
                        </TabsContent>
                        <TabsContent value="ar_feature" className="space-y-2 pt-2">
                          <div className="grid gap-2"><Label>العنوان</Label><Input dir="rtl" {...form.register(`features.${index}.title.ar`)} />{errors.features?.[index]?.title?.ar && <p className="text-destructive text-sm">{errors.features[index]?.title?.ar?.message}</p>}</div>
                          <div className="grid gap-2"><Label>الوصف</Label><Textarea dir="rtl" {...form.register(`features.${index}.description.ar`)} />{errors.features?.[index]?.description?.ar && <p className="text-destructive text-sm">{errors.features[index]?.description?.ar?.message}</p>}</div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => append({ icon: "CheckCircle2", title: { en: "", ar: "" }, description: { en: "", ar: "" } })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('addFeature')}
                  </Button>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {service ? tg('saveChanges') : tg('add')}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
