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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Partner } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addPartnerAction, updatePartnerAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useTranslations } from "next-intl";


interface PartnerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  partner: Partner | null;
  onSubmit: () => void;
}

export function PartnerForm({ isOpen, onOpenChange, partner, onSubmit }: PartnerFormProps) {
  const t = useTranslations("Admin.partnersPage");
  const tGeneral = useTranslations("Admin.general");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const iconOptions = ["Globe", "CircuitBoard", "Rocket", "Bot", "Building"];

  const partnerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, t("nameMin")),
    logo: z.string().min(1, t("logoRequired")),
    dataAiHint: z.string().optional(),
  });

  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      logo: "Globe",
      dataAiHint: "",
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset({
        ...partner,
        id: partner.id?.toString(),
      });
    } else {
      form.reset({
        name: "",
        logo: "Globe",
        dataAiHint: "",
      });
    }
  }, [partner, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof partnerSchema>) => {
    startTransition(async () => {
      const action = partner ? updatePartnerAction : addPartnerAction;
      const result = await action({
        ...values,
        id: values.id?.toString(),
      });

      if (result.success) {
        toast({
          title: tGeneral("itemUpdated", { item: t("item") }),
          description: result.message,
        });
        onSubmit();
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{partner ? tGeneral("editTitle", { item: t("item") }) : tGeneral("addTitle", { item: t("item") })}</DialogTitle>
          <DialogDescription>
            {partner ? tGeneral("editDesc", { item: t("item") }) : tGeneral("addDesc", { item: t("item") })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{tGeneral("name")}</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">{t("logo")}</Label>
            <Select onValueChange={(value) => form.setValue('logo', value)} defaultValue={form.getValues('logo')}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectLogo")} />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(icon => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.logo && <p className="text-destructive text-sm">{form.formState.errors.logo.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">{t("imageHint")}</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder={t("imageHintPlaceholder")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full" aria-label={partner ? tGeneral("saveChanges") : tGeneral("add")}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {partner ? tGeneral("saveChanges") : tGeneral("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
