
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

interface PartnerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  partner: Partner | null;
  onSubmit: () => void;
}

const partnerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  logo: z.string().min(1, "Logo is required."),
});

const iconOptions = ["Globe", "CircuitBoard", "Rocket", "Bot"];

export function PartnerForm({ isOpen, onOpenChange, partner, onSubmit }: PartnerFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      logo: "Globe",
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset(partner);
    } else {
      form.reset({
        name: "",
        logo: "Globe",
      });
    }
  }, [partner, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof partnerSchema>) => {
    startTransition(async () => {
      const action = partner ? updatePartnerAction : addPartnerAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: partner ? "Partner Updated" : "Partner Added",
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
          <DialogTitle>{partner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
          <DialogDescription>
            {partner ? "Update the details of this partner." : "Fill in the details to add a new partner."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">Logo</Label>
            <Select onValueChange={(value) => form.setValue('logo', value)} defaultValue={form.getValues('logo')}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a logo" />
                </SelectTrigger>
                <SelectContent>
                    {iconOptions.map(icon => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {form.formState.errors.logo && <p className="text-destructive text-sm">{form.formState.errors.logo.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {partner ? "Save Changes" : "Add Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
