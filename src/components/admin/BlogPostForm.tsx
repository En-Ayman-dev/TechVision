
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BlogPost } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addBlogPostAction, updateBlogPostAction } from "@/app/actions";
import { useTranslations } from "next-intl"; // Added useTranslations import

interface BlogPostFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: BlogPost | null;
  onSubmit: () => void;
}

export function BlogPostForm({ isOpen, onOpenChange, post, onSubmit }: BlogPostFormProps) {
  const t = useTranslations("Admin.BlogForm"); // Initialize translation function
  const tGeneral = useTranslations("Admin.general"); // Initialize general translation function

  const blogPostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, t("titleMin")),
    author: z.string().min(2, t("authorMin")),
    category: z.string().min(2, t("categoryMin")),
    tags: z.string().optional(),
    content: z.string().min(10, t("contentMin")),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  });
  
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      tags: "",
      content: "",
      published: true,
      featured: false,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        ...post,
        tags: post.tags.join(", "),
      });
    } else {
      form.reset({
        title: "",
        author: "",
        category: "",
        tags: "",
        content: "",
        published: true,
        featured: false,
      });
    }
  }, [post, form, isOpen]);

  const handleSubmit = (values: z.infer<typeof blogPostSchema>) => {
    const action = post ? updateBlogPostAction : addBlogPostAction;
    const postData = {
      id: post?.id,
      ...values,
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
    };
    
    startTransition(async () => {
      const result = await action(postData);
      
      if (result.success) {
        toast({
          title: post ? t("updateSuccess") : t("addSuccess"),
          description: result.message,
        });
        onSubmit();
      } else {
        toast({ title: tGeneral("error"), description: result.message, variant: "destructive" });
      }
    });
   };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{post ? t("editPost") : t("addPost")}</DialogTitle>
          <DialogDescription>
            {t("dialogDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{tGeneral("title")}</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">{t("author")}</Label>
            <Input id="author" {...form.register("author")} />
            {form.formState.errors.author && <p className="text-destructive text-sm">{form.formState.errors.author.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">{tGeneral("category")}</Label>
            <Input id="category" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-destructive text-sm">{form.formState.errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">{t("tags")}</Label>
            <Input id="tags" {...form.register("tags")} placeholder={t("tagsPlaceholder")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">{t("content")}</Label>
            <Textarea id="content" {...form.register("content")} rows={10} />
            {form.formState.errors.content && <p className="text-destructive text-sm">{form.formState.errors.content.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              {...form.register("published")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="published">{t("publishPost")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              {...form.register("featured")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="featured">{t("featuredPost")}</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full" aria-label={post ? tGeneral("saveChanges") : tGeneral("add")}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? tGeneral("saveChanges") : tGeneral("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
