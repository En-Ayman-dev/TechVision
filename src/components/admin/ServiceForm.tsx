
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Service } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addServiceAction, updateServiceAction, generateServiceDescriptionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTranslations } from "next-intl"; // تم إضافة useTranslations

interface ServiceFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: Service | null;
  onSubmit: () => void;
}

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, "Icon is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  dataAiHint: z.string().optional(),
});

const iconOptions = ["Code", "Cloud", "PenTool", "Database", "Shield", "LineChart"];

export function ServiceForm({ isOpen, onOpenChange, service, onSubmit }: ServiceFormProps) {
  
  const t = useTranslations('Admin.servicesPage'); 
  const tg = useTranslations('Admin.general'); 
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      icon: "Code",
      title: "",
      description: "",
      dataAiHint: "",
    },
  });

  useEffect(() => {
    if (service) {
      form.reset(service);
    } else {
      form.reset({
        icon: "Code",
        title: "",
        description: "",
        dataAiHint: "",
      });
    }
  }, [service, form, isOpen]);

  const handleGenerateDescription = () => {
    const title = form.getValues("title");
    if (!title || title.length < 2) {
      toast({
        title: tg('titleRequired'),
        description: tg('titleRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    startGeneratingTransition(async () => {
      const result = await generateServiceDescriptionAction(title);
      if (result.success && result.description) {
        form.setValue("description", result.description, { shouldValidate: true });
        toast({
           title: tg('descriptionGenerated'),
          description: tg('descriptionGeneratedDesc'),
        });
      } else {
        toast({
          title: tg('generationFailed'),
          description: result.message || tg('generationFailedDesc'),
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    startTransition(async () => {
      const action = service ? updateServiceAction : addServiceAction;
      const result = await action({
        ...values,
        id: values.id?.toString(),
      });

      if (result.success) {
        toast({
          title: service ? t('serviceUpdated') : t('serviceAdded'),
          description: result.message,
        });
        onSubmit();
      } else {
        toast({
          title:  tg('error'),
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? t('editService') : t('addService')}</DialogTitle>
          <DialogDescription>
            {service ? t('editServiceDescription') : t('addServiceDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{tg('title')}</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">{tg('icon')}</Label>
            <Select onValueChange={(value) => form.setValue('icon', value)} defaultValue={form.getValues('icon')}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(icon => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.icon && <p className="text-destructive text-sm">{form.formState.errors.icon.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">{tg('description')}</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating} aria-label={tg('generate')}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {tg('generate')}
              </Button>
            </div>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">{tg('hint')}</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder="e.g., 'cloud security'" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full" aria-label={service ? tg('saveChanges') : tg('add')}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? tg('saveChanges') : tg('add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
