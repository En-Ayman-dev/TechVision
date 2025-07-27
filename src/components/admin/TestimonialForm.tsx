
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
import type { Testimonial } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { addTestimonialAction, updateTestimonialAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  testimonial: Testimonial | null;
  onSubmit: () => void;
}

const testimonialSchema = z.object({
  id: z.number().optional(),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  author: z.string().min(2, "Author must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  image: z.string().url("Image must be a valid URL (e.g., https://placehold.co/100x100.png)."),
  dataAiHint: z.string().optional(),
});

export function TestimonialForm({ isOpen, onOpenChange, testimonial, onSubmit }: TestimonialFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: "",
      author: "",
      role: "",
      image: "https://placehold.co/100x100.png",
      dataAiHint: ""
    },
  });

  useEffect(() => {
    if (testimonial) {
      form.reset(testimonial);
    } else {
      form.reset({
        quote: "",
        author: "",
        role: "",
        image: "https://placehold.co/100x100.png",
        dataAiHint: ""
      });
    }
  }, [testimonial, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof testimonialSchema>) => {
    startTransition(async () => {
      const action = testimonial ? updateTestimonialAction : addTestimonialAction;
      const result = await action(values);
      if (result.success) {
        toast({
          title: testimonial ? "Testimonial Updated" : "Testimonial Added",
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
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {testimonial ? "Update the details of the testimonial." : "Fill in the details to add a new testimonial."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...form.register("author")} />
            {form.formState.errors.author && <p className="text-destructive text-sm">{form.formState.errors.author.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...form.register("role")} />
            {form.formState.errors.role && <p className="text-destructive text-sm">{form.formState.errors.role.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" {...form.register("quote")} />
            {form.formState.errors.quote && <p className="text-destructive text-sm">{form.formState.errors.quote.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...form.register("image")} />
             {form.formState.errors.image && <p className="text-destructive text-sm">{form.formState.errors.image.message}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...form.register("dataAiHint")} placeholder="e.g., 'happy client'"/>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testimonial ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
