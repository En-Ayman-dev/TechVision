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
import type { Project } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addProjectAction, updateProjectAction, generateProjectDescriptionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";


interface ProjectFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: Project | null;
  onSubmit: () => void;
}

export function ProjectForm({ isOpen, onOpenChange, project, onSubmit }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations("Admin.projectsPage");
  const tGeneral = useTranslations("Admin.general");


  const projectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, t("titleMin")),
    category: z.string().min(2, t("categoryMin")),
    description: z.string().min(10, t("descMin")),
    image: z.string().url(t("imageUrlValidation")),
    dataAiHint: z.string().optional(),
  });
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      image: "https://placehold.co/600x400.png",
      dataAiHint: ""
    },
  });

  useEffect(() => {
    if (project) {
      form.reset(project);
    } else {
      form.reset({
        title: "",
        category: "",
        description: "",
        image: "https://placehold.co/600x400.png",
        dataAiHint: ""
      });
    }
  }, [project, form, isOpen]);

  const handleGenerateDescription = () => {
    const title = form.getValues("title");
    if (!title || title.length < 2) {
      toast({
        title: t("titleRequired"),
        description: t("titleRequiredDesc"),
        variant: "destructive",
      });
      return;
    }
    startGeneratingTransition(async () => {
      const result = await generateProjectDescriptionAction(title);
      if (result.success && result.description) {
        form.setValue("description", result.description, { shouldValidate: true });
        toast({
          title: tGeneral("descriptionGenerated"),
          description: tGeneral("descriptionGeneratedDesc"),
        });
      } else {
        toast({
          title: tGeneral("generationFailed"),
          description: result.message || tGeneral("generationFailedDesc"),
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = (values: z.infer<typeof projectSchema>) => {
    startTransition(async () => {
      const action = project ? updateProjectAction : addProjectAction;
      const result = await action({
        ...values,
        id: values.id?.toString(),
      });

      if (result.success) {
        toast({
          title: project ? tGeneral("itemUpdated", { item: t("item") }) : tGeneral("itemAdded", { item: t("item") }),
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
          <DialogTitle>{project ? tGeneral("editTitle", { item: t("item") }) : tGeneral("addTitle", { item: t("item") })}</DialogTitle>
          <DialogDescription>
            {project ? tGeneral("editDesc", { item: t("item") }) : tGeneral("addDesc", { item: t("item") })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{tGeneral("title")}</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">{tGeneral("category")}</Label>
            <Input id="category" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-destructive text-sm">{form.formState.errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">{tGeneral("description")}</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {tGeneral("generate")}
              </Button>
            </div>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">{t("imageUrl")}</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image && <p className="text-destructive text-sm">{form.formState.errors.image.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">{t("imageHint")}</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder={t("imageHintPlaceholder")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? tGeneral("saveChanges") : tGeneral("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
