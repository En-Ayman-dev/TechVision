"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/search"
import { LoadingSpinner, SkeletonList } from "@/components/ui/loading-spinner"
import { useNotifications } from "@/components/ui/notification"
import { Calendar, User, Tag, Eye, Heart, Share2, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useTranslations, useLocale } from 'next-intl';

// استيراد Firebase و Realtime Database
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update, Database } from 'firebase/database';


export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  views: number
  likes: number
  featured: boolean
  published: boolean
}

interface BlogSystemProps {
  isAdmin?: boolean
}

// دالة مساعدة لتحويل الوسم إلى مفتاح صالح في ملف الترجمة
const tagToKey = (tag: string) => tag.replace(/\./g, '_');

// يجب إضافة هذا في ملف 'types.d.ts' أو في بداية الملف لتعريف المتغيرات العامة
declare global {
  const __app_id: string;
  const __firebase_config: string;
  const __initial_auth_token: string;
}

export function BlogSystem({ isAdmin = false }: BlogSystemProps) {
  // استخدام useTranslations لجلب نصوص الترجمة
  const t = useTranslations('BlogSystem');
  // استخدام useLocale لتحديد اتجاه الكتابة
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addNotification } = useNotifications();
  // تم تعديل نوع المتغير ليقبل 'Database' أو 'null'
  const [db, setDb] = useState<Database | null>(null);


  // تهيئة Firebase والاتصال بـ Realtime Database
  useEffect(() => {
    // استخدم متغيرات البيئة العامة كما هو موضح في التعليمات
    // تم إضافة التأكد من وجود المتغيرات لتجنب الأخطاء
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

    try {
      // التحقق من وجود databaseURL وإضافته إذا كان غير موجود
      // تم تعديل هذا الجزء لاستخدام متغير البيئة
      const databaseUrlFromEnv = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
      if (databaseUrlFromEnv) {
        firebaseConfig.databaseURL = databaseUrlFromEnv;
      } else if (firebaseConfig.projectId) {
        firebaseConfig.databaseURL = `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`;
      }

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      setDb(database);
      const dbRef = ref(database, `artifacts/${appId}/blogPosts`);

      // الاستماع للتحديثات في الوقت الفعلي
      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          // Realtime Database يعيد البيانات ككائن، نحوله إلى مصفوفة
          const data = snapshot.val();
          const fetchedPosts: BlogPost[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            // تحويل التواريخ من سلسلة نصية إلى كائنات Date
            publishedAt: new Date(data[key].publishedAt),
            updatedAt: new Date(data[key].updatedAt)
          }));
          setPosts(fetchedPosts);
          setFilteredPosts(fetchedPosts);
        } else {
          setPosts([]);
          setFilteredPosts([]);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching documents: ", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsLoading(false);
    }
  }, []);

  // تحديث القيم الديناميكية بناءً على البيانات من Realtime Database
  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))]
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  const searchFilters = allTags.map(tag => ({
    id: tagToKey(tag),
    label: tag,
    value: tagToKey(tag),
    category: t("search.tagsCategory")
  }))

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

  // هذه الوظيفة تم تفعيلها الآن
  const handleLike = async (postId: string) => {
    if (!db) return;
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const postRef = ref(db, `artifacts/${appId}/blogPosts/${postId}`);
      const post = posts.find(p => p.id === postId);
      if (post) {
        // استخدام `update` لزيادة عدد الإعجابات في قاعدة البيانات
        await update(postRef, { likes: post.likes + 1 });
        addNotification({
          type: "success",
          title: t("notifications.liked.title"),
          description: t("notifications.liked.description"),
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href + `/blog/${post.id}`,
        })
      } catch (error) {
        navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`)
        addNotification({
          type: "success",
          title: t("notifications.linkCopied.title"),
          description: t("notifications.linkCopied.description"),
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href + `/blog/${post.id}`)
      addNotification({
        type: "success",
        title: t("notifications.linkCopied.title"),
        description: t("notifications.linkCopied.description"),
      })
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
          <Button>
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
              onClick={() => {
                setSelectedCategory(category)
                handleSearch("", [])
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

  // دالة مساعدة لترجمة الوسوم والفئات
  const translateTag = (tag: string) => t(`tags.${tagToKey(tag)}`);
  const translateCategory = (category: string) => t(`categories.${category}`);

  return (
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
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
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
              {format(post.publishedAt, "MMM dd, yyyy")}
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
            >
              <Heart className={`w-4 h-4 ${iconMargin}`} />
              {post.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post)}
              className="text-muted-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
