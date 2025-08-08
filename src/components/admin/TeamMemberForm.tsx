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
import type { TeamMember } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addTeamMemberAction, updateTeamMemberAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TeamMemberFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: TeamMember | null;
  onSubmit: () => void;
}

export function TeamMemberForm({ isOpen, onOpenChange, member, onSubmit }: TeamMemberFormProps) {
  const t = useTranslations("Admin.teamPage");
  const tGeneral = useTranslations("Admin.general");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const teamMemberSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, t("nameMin")),
    role: z.string().min(2, t("roleMin")),
    image: z.string().url(t("imageUrlValidation")),
    social: z.object({
      twitter: z.string().url(t("twitterUrlValidation")).or(z.literal("")),
      linkedin: z.string().url(t("linkedinUrlValidation")).or(z.literal("")),
    }),
    dataAiHint: z.string().optional(),
  });
  
  const form = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      image: "https://placehold.co/400x400.png",
      social: { twitter: "", linkedin: "" },
      dataAiHint: ""
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        ...member,
        id: member.id?.toString(),
      });
    } else {
      form.reset({
        name: "",
        role: "",
        image: "https://placehold.co/400x400.png",
        social: { twitter: "", linkedin: "" },
        dataAiHint: ""
      });
    }
  }, [member, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof teamMemberSchema>) => {
    startTransition(async () => {
      const action = member ? updateTeamMemberAction : addTeamMemberAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: member ? tGeneral("itemUpdated", { item: t("item") }) : tGeneral("itemAdded", { item: t("item") }),
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
          <DialogTitle>{member ? tGeneral("editTitle", { item: t("item") }) : tGeneral("addTitle", { item: t("item") })}</DialogTitle>
          <DialogDescription>
            {member ? tGeneral("editDesc", { item: t("item") }) : tGeneral("addDesc", { item: t("item") })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{tGeneral("name")}</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">{t("role")}</Label>
            <Input id="role" {...form.register("role")} />
            {form.formState.errors.role && <p className="text-destructive text-sm">{form.formState.errors.role.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">{t("imageUrl")}</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image && <p className="text-destructive text-sm">{form.formState.errors.image.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="twitter">{t("twitterUrl")}</Label>
            <Input id="twitter" {...form.register("social.twitter")} placeholder="#" />
            {form.formState.errors.social?.twitter && <p className="text-destructive text-sm">{form.formState.errors.social.twitter.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">{t("linkedinUrl")}</Label>
            <Input id="linkedin" {...form.register("social.linkedin")} placeholder="#" />
            {form.formState.errors.social?.linkedin && <p className="text-destructive text-sm">{form.formState.errors.social.linkedin.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">{t("imageHint")}</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder={t("imageHintPlaceholder")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {member ? tGeneral("saveChanges") : tGeneral("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
