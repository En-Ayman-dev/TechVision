
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
import { addProjectAction, updateProjectAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: Project | null;
  onSubmit: () => void;
}

const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  image: z.string().url("Image must be a valid URL (e.g., https://placehold.co/600x400.png)."),
  dataAiHint: z.string().optional(),
});

export function ProjectForm({ isOpen, onOpenChange, project, onSubmit }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
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

  const handleSubmit = (values: z.infer<typeof projectSchema>) => {
    startTransition(async () => {
      const action = project ? updateProjectAction : addProjectAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: project ? "Project Updated" : "Project Added",
          description: result.message,
        });
        onSubmit();
      } else {
        toast({
          title: "Error",
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
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update the details of your project." : "Fill in the details to add a new project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-destructive text-sm">{form.formState.errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...form.register("image")} />
             {form.formState.errors.image && <p className="text-destructive text-sm">{form.formState.errors.image.message}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder="e.g., 'dashboard chart'"/>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
