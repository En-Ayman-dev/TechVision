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
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { addBlogPostAction, updateBlogPostAction, generateBlogPostAction } from "@/app/actions"; // 1. Import AI action
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 2. Import Tabs components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BlogPostFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: BlogPost | null;
  onSubmit: () => void;
}

export function BlogPostForm({ isOpen, onOpenChange, post, onSubmit }: BlogPostFormProps) {
  const t = useTranslations("Admin.BlogForm");
  const tGeneral = useTranslations("Admin.general");

  const blogPostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, t("titleMin")),
    author: z.string().min(2, t("authorMin")),
    category: z.string().min(2, t("categoryMin")),
    tags: z.string().optional(),
    content: z.string().min(10, t("contentMin")),
    excerpt: z.string().min(10, t("excerptMin")).optional().or(z.literal('')),
    featuredImage: z.string().url(t("imageUrlValidation")).optional().or(z.literal('')),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  });

  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition(); // State for AI generation
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  const [aiTitle, setAiTitle] = useState("");
  const [aiLanguage, setAiLanguage] = useState<'en' | 'ar'>('en');

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "", author: "", category: "", tags: "", content: "",
      excerpt: "", featuredImage: "", published: true, featured: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
        setActiveTab("manual"); // Reset to manual tab when dialog opens
        if (post) {
            form.reset({ ...post, tags: post.tags?.join(", ") || "" });
        } else {
            form.reset({
                title: "", author: "TechVision Team", category: "", tags: "", content: "",
                excerpt: "", featuredImage: "", published: true, featured: false,
            });
        }
    }
  }, [post, form, isOpen]);

  const handleGenerate = () => {
    if (!aiTitle) {
        toast({ title: t("ai.titleRequired"), variant: "destructive" });
        return;
    }
    startGeneratingTransition(async () => {
        const result = await generateBlogPostAction(aiTitle, aiLanguage);
        if (result.success && result.data) {
            const { title, excerpt, content, category, tags } = result.data;
            // Populate the form with AI-generated content
            form.setValue("title", title);
            form.setValue("excerpt", excerpt);
            form.setValue("content", content);
            form.setValue("category", category);
            form.setValue("tags", tags.join(", "));
            toast({ title: t("ai.successTitle"), description: t("ai.successDesc") });
            setActiveTab("manual"); // Switch to the manual tab for review
        } else {
            toast({ title: tGeneral("error"), description: result.message, variant: "destructive" });
        }
    });
  }

  const handleSubmit = (values: z.infer<typeof blogPostSchema>) => {
    const action = post ? updateBlogPostAction : addBlogPostAction;
    const postData = {
      ...values,
      id: post?.id,
      tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
    };

    startTransition(async () => {
      const result = await action(postData as any);
      if (result.success) {
        toast({ title: post ? t("updateSuccess") : t("addSuccess"), description: result.message });
        onSubmit();
      } else {
        toast({ title: tGeneral("error"), description: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post ? t("editPost") : t("addPost")}</DialogTitle>
          <DialogDescription>{t("dialogDesc")}</DialogDescription>
        </DialogHeader>
        
        {/* --- 3. The New Tabs UI --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">{t("tabs.manual")}</TabsTrigger>
            <TabsTrigger value="ai">{t("tabs.ai")}</TabsTrigger>
          </TabsList>
          
          {/* AI Generation Tab */}
          <TabsContent value="ai">
            <div className="space-y-6 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="ai-title">{t("ai.titleLabel")}</Label>
                    <Input id="ai-title" value={aiTitle} onChange={(e) => setAiTitle(e.target.value)} placeholder={t("ai.titlePlaceholder")} />
                    <p className="text-sm text-muted-foreground">{t("ai.titleHint")}</p>
                </div>
                <div className="grid gap-2">
                    <Label>{t("ai.languageLabel")}</Label>
                    <RadioGroup defaultValue="en" value={aiLanguage} onValueChange={(value) => setAiLanguage(value as 'en' | 'ar')}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="en" id="lang-en" />
                            <Label htmlFor="lang-en">English</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ar" id="lang-ar" />
                            <Label htmlFor="lang-ar">العربية</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {t("ai.generateButton")}
                </Button>
            </div>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-6">
                <div className="grid gap-2">
                    <Label htmlFor="title">{tGeneral("title")}</Label>
                    <Input id="title" {...form.register("title")} />
                    {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="featuredImage">{t("featuredImage")}</Label>
                    <Input id="featuredImage" {...form.register("featuredImage")} placeholder={t("featuredImagePlaceholder")} />
                    {form.formState.errors.featuredImage && <p className="text-destructive text-sm">{form.formState.errors.featuredImage.message}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="excerpt">{t("excerpt")}</Label>
                    <Textarea id="excerpt" {...form.register("excerpt")} rows={3} placeholder={t("excerptPlaceholder")} />
                    {form.formState.errors.excerpt && <p className="text-destructive text-sm">{form.formState.errors.excerpt.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="published" checked={form.watch("published")} onCheckedChange={(checked) => form.setValue("published", checked)} />
                        <Label htmlFor="published">{t("publishPost")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="featured" checked={form.watch("featured")} onCheckedChange={(checked) => form.setValue("featured", checked)} />
                        <Label htmlFor="featured">{t("featuredPost")}</Label>
                    </div>
                </div>
                <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {post ? tGeneral("saveChanges") : tGeneral("add")}
                    </Button>
                </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
