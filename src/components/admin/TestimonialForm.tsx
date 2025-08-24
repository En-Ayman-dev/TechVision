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
import { addTestimonialAction, updateTestimonialAction, generateTestimonialQuoteAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TestimonialFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  testimonial: Testimonial | null;
  onSubmit: () => void;
}

export function TestimonialForm({ isOpen, onOpenChange, testimonial, onSubmit }: TestimonialFormProps) {
  const t = useTranslations("Admin.testimonialsPage");
  const tGeneral = useTranslations("Admin.general");
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const { toast } = useToast();

  const testimonialSchema = z.object({
    id: z.string().optional(),
    quote: z.string().min(10, t("quoteMin")),
    author: z.string().min(2, t("authorMin")),
    role: z.string().min(2, t("roleMin")),
    image: z.string().url(t("imageUrlValidation")),
    dataAiHint: z.string().optional(),
  });

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

  const handleGenerateQuote = () => {
    const author = form.getValues("author");
    if (!author || author.length < 2) {
      toast({
        title: t("authorRequired"),
        description: t("authorRequiredDesc"),
        variant: "destructive",
      });
      return;
    }
    startGeneratingTransition(async () => {
      const result = await generateTestimonialQuoteAction(author);
      if (result.success && result.quote) {
        form.setValue("quote", result.quote, { shouldValidate: true });
        toast({
          title: tGeneral("generateQuoteSuccess"),
          description: tGeneral("generateQuote"),
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

  const handleSubmit = (values: z.infer<typeof testimonialSchema>) => {
    startTransition(async () => {
      const action = testimonial ? updateTestimonialAction : addTestimonialAction;
      const result = await action({
        ...values,
        id: values.id?.toString(),
      });

      if (result.success) {
        toast({
          title: testimonial ? tGeneral("itemUpdated", { item: t("item") }) : tGeneral("itemAdded", { item: t("item") }),
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
          <DialogTitle>{testimonial ? tGeneral("editTitle", { item: t("item") }) : tGeneral("addTitle", { item: t("item") })}</DialogTitle>
          <DialogDescription>
            {testimonial ? tGeneral("editDesc", { item: t("item") }) : tGeneral("addDesc", { item: t("item") })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="author">{t("author")}</Label>
            <Input id="author" {...form.register("author")} />
            {form.formState.errors.author && <p className="text-destructive text-sm">{form.formState.errors.author.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">{t("role")}</Label>
            <Input id="role" {...form.register("role")} />
            {form.formState.errors.role && <p className="text-destructive text-sm">{form.formState.errors.role.message}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="quote">{t("quote")}</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleGenerateQuote} disabled={isGenerating} aria-label={t("generate")}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {tGeneral("generate")}
              </Button>
            </div>
            <Textarea id="quote" {...form.register("quote")} />
            {form.formState.errors.quote && <p className="text-destructive text-sm">{form.formState.errors.quote.message}</p>}
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
            <Button type="submit" disabled={isPending} className="w-full" aria-label={testimonial ? tGeneral("saveChanges") : tGeneral("add")}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testimonial ? tGeneral("saveChanges") : tGeneral("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
