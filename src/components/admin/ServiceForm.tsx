
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
import { addServiceAction, updateServiceAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ServiceFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: Service | null;
  onSubmit: () => void;
}

const serviceSchema = z.object({
  id: z.number().optional(),
  icon: z.string().min(1, "Icon is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  dataAiHint: z.string().optional(),
});

const iconOptions = ["Code", "Cloud", "PenTool", "Database", "Shield", "LineChart"];

export function ServiceForm({ isOpen, onOpenChange, service, onSubmit }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition();
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

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    startTransition(async () => {
      const action = service ? updateServiceAction : addServiceAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: service ? "Service Updated" : "Service Added",
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
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service ? "Update the details of your service." : "Fill in the details to add a new service."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
            {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder="e.g., 'cloud security'"/>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
