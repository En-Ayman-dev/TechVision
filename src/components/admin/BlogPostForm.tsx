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

interface BlogPostFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: BlogPost | null;
  onSubmit: () => void;
}

const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "يجب أن يتكون العنوان من حرفين على الأقل."),
  author: z.string().min(2, "يجب أن يتكون اسم المؤلف من حرفين على الأقل."),
  category: z.string().min(2, "يجب أن تتكون الفئة من حرفين على الأقل."),
  tags: z.string().optional(),
  content: z.string().min(10, "يجب أن يتكون المحتوى من 10 أحرف على الأقل."),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export function BlogPostForm({ isOpen, onOpenChange, post, onSubmit }: BlogPostFormProps) {
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
        // tags: values.tags?.split(",").map(tag => tag.trim()) || [],
        // publishedAt: new Date(),
        // updatedAt: new Date(),
        // excerpt: values.content.substring(0, 150) + "...",
        // views: 0,
        // likes: 0,
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
      };
    
    startTransition(async () => {
      const result = await action(postData);
      
      if (result.success) {
        toast({
          title: post ? "تم تحديث المقالة" : "تم إضافة المقالة",
          description: result.message,
        });
        onSubmit();
      } else {
        toast({ title: "خطأ", description: result.message, variant: "destructive" });
      }
    });
   };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{post ? "تعديل مقالة" : "إضافة مقالة جديدة"}</DialogTitle>
          <DialogDescription>
            املأ التفاصيل لإدارة مقالة المدونة.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">العنوان</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">المؤلف</Label>
            <Input id="author" {...form.register("author")} />
            {form.formState.errors.author && <p className="text-destructive text-sm">{form.formState.errors.author.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">الفئة</Label>
            <Input id="category" {...form.register("category")} />
            {form.formState.errors.category && <p className="text-destructive text-sm">{form.formState.errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">الكلمات المفتاحية (افصل بينها بفاصلة)</Label>
            <Input id="tags" {...form.register("tags")} placeholder="مثل: React, Next.js, AI" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">المحتوى</Label>
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
            <Label htmlFor="published">نشر المقالة</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              {...form.register("featured")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="featured">مقالة مميزة</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {post ? "حفظ التغييرات" : "إضافة مقالة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}