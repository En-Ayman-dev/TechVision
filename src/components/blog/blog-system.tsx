
"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/search"
import { LoadingSpinner, SkeletonList } from "@/components/ui/loading-spinner"
import { useNotifications } from "@/components/ui/notification"
import { Calendar, User, Tag, Eye, Heart, Share2, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useTranslations, useLocale } from 'next-intl';

import type { BlogPost } from "@/lib/types"; // استيراد نوع BlogPost الموحد

interface BlogSystemProps {
  isAdmin?: boolean;
  posts: BlogPost[]; // تم إضافة خاصية المنشورات هنا
}

// دالة مساعدة لتحويل الوسم إلى مفتاح صالح في ملف الترجمة
// const tagToKey = (tag: string) => tag.replace(/\./g, '_');
const tagToKey = (tag: string) =>
  tag.replace(/\s+/g, '_').replace(/[^\w]/g, '');

export function BlogSystem({ isAdmin = false, posts }: BlogSystemProps) {
  const t = useTranslations('BlogSystem');
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  // تحديث القيم الديناميكية بناءً على البيانات من prop
  const categories = useMemo(() => ["all", ...Array.from(new Set(posts.map(post => post.category)))], [posts]);
  const allTags = useMemo(() => Array.from(new Set(posts.flatMap(post => post.tags))), [posts]);

  const searchFilters = allTags.map(tag => ({
    id: tagToKey(tag),
    label: tag,
    value: tagToKey(tag),
    category: t("search.tagsCategory")
  }));

  // إعادة فلترة المنشورات عندما تتغير المنشورات الأصلية
  React.useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleSearch = (query: string, filters: any[]) => {
    let filtered = posts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (query) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.length > 0) {
      filtered = filtered.filter(post =>
        filters.some(filter => post.tags.includes(filter.label))
      );
    }

    setFilteredPosts(filtered);
  }

  // هذه الوظيفة تظل غير مفعلة كما طلبت
  const handleLike = (postId: string) => {
    addNotification({
      type: "success",
      title: t("notifications.liked.title"),
      description: t("notifications.liked.description"),
    });
  }

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href + `/blog/${post.id}`,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`);
        addNotification({
          type: "success",
          title: t("notifications.linkCopied.title"),
          description: t("notifications.linkCopied.description"),
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`);
      addNotification({
        type: "success",
        title: t("notifications.linkCopied.title"),
        description: t("notifications.linkCopied.description"),
      });
    }
  }

  // هذه الوظيفة تظل غير مفعلة كما طلبت
  const handleDelete = (postId: string) => {
    console.log(`Delete functionality for post ${postId} is not enabled.`);
  }

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('header.title')}</h1>
          <p className="text-muted-foreground">
            {t('header.subtitle')}
          </p>
        </div>
        {isAdmin && (
          <Button variant="outline" className="flex items-center" aria-label={t('buttons.newPost')}>
            <Edit className={`w-4 h-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {t('buttons.newPost')}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchComponent
          placeholder={t('search.placeholder')}
          onSearch={handleSearch}
          availableFilters={searchFilters}
        />

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              aria-label={category === "all" ? t("search.allCategories") : category}
              onClick={() => {
                setSelectedCategory(category);
                handleSearch("", []);
              }}
            >
              {category === "all" ? t("search.allCategories") : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      {isLoading ? (
        <SkeletonList count={3} />
      ) : (
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{t('noPostsFound')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <BlogPostCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onLike={handleLike}
                onShare={handleShare}
                onDelete={handleDelete}
                dir={dir}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface BlogPostCardProps {
  post: BlogPost
  isAdmin: boolean
  onLike: (postId: string) => void
  onShare: (post: BlogPost) => void
  onDelete: (postId: string) => void
  dir: 'rtl' | 'ltr'
}

function BlogPostCard({ post, isAdmin, onLike, onShare, onDelete, dir }: BlogPostCardProps) {
  const t = useTranslations('BlogSystem');
  const iconMargin = dir === 'rtl' ? 'ml-1' : 'mr-1';

  const translateTag = (tag: string) => {
    const key = tagToKey(tag);
    try {
      return t(`tags.${key}`);
    } catch (err) {
      console.warn(`Missing translation for tag: ${key}`);
      return tag;
    }
  };

  const translateCategory = (category: string) => {
    const key = tagToKey(category);
    try {
      return t(`categories.${key}`);
    } catch (err) {
      console.warn(`Missing translation for category: ${key}`);
      return category;
    }
  };



  return (
    <section id="BlogSystem" className="bg-secondary/50">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {post.featured && (
                  <Badge variant="secondary">{t('card.featured')}</Badge>
                )}
                <Badge variant="outline">{translateCategory(post.category)}</Badge>
              </div>
              <CardTitle className="text-xl hover:text-primary cursor-pointer">
                {post.title}
              </CardTitle>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" aria-label={t('buttons.edit')}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(post.id)}
                  aria-label={t('buttons.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>

          <div className={`flex flex-wrap gap-2 mb-4 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className={`w-3 h-3 ${iconMargin}`} />
                {translateTag(tag)}
              </Badge>
            ))}
          </div>

          <div className={`flex items-center justify-between text-sm text-muted-foreground ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
              <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publishedAt), "MMM dd, yyyy")}
              </div>
              <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
                <Eye className="w-4 h-4" />
                {post.views}
              </div>
            </div>

            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'rtl:space-x-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(post.id)}
                className="text-muted-foreground hover:text-red-500"
                aria-label={t('buttons.like')}

              >
                <Heart className={`w-4 h-4 ${iconMargin}`} />
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(post)}
                className="text-muted-foreground"
                aria-label={t('buttons.share')}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}