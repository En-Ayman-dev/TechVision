"use client"

import React, { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchComponent } from "@/components/ui/search"
import { SkeletonList } from "@/components/ui/loading-spinner"
import { Calendar, User, Tag, Edit, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useTranslations, useLocale } from 'next-intl';
import Link from "next/link";
import { motion, useScroll, useTransform, Variants, useMotionValue, useSpring } from "framer-motion";
import { InteractiveParticles } from "@/components/ui/interactive-particles";
import type { BlogPost } from "@/lib/types";

interface BlogSystemProps {
  isAdmin?: boolean;
  posts: BlogPost[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Reusable AnimatedCard component for blog posts
const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div ref={ref} style={{ y }} className="w-full h-full" variants={itemVariants}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}


export function BlogSystem({ isAdmin = false, posts }: BlogSystemProps) {
  const t = useTranslations('BlogSystem');
  const locale = useLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(posts.map(post => post.category)))], [posts]);
  const allTags = useMemo(() => Array.from(new Set(posts.flatMap(post => post.tags))), [posts]);

  const searchFilters = allTags.map(tag => ({
    id: tag.replace(/\s+/g, '_'),
    label: tag,
    value: tag.replace(/\s+/g, '_'),
    category: t("search.tagsCategory")
  }));

  React.useEffect(() => {
    let filtered = posts;
    if (selectedCategory !== "all") {
      filtered = posts.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
  }, [posts, selectedCategory]);

  const handleSearch = (query: string, filters: any[]) => {
    let filtered = selectedCategory === "all" ? posts : posts.filter(p => p.category === selectedCategory);

    if (query) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filters.length > 0) {
      filtered = filtered.filter(post =>
        filters.some(filter => post.tags.includes(filter.label))
      );
    }
    setFilteredPosts(filtered);
  }

  return (
    <section id="BlogSystem" className="relative bg-background overflow-hidden -m-4 p-4">
      <InteractiveParticles />
      <div className="space-y-8 relative z-10" dir={dir}>
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">{t('header.title')}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t('header.subtitle')}</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <SearchComponent
            placeholder={t('search.placeholder')}
            onSearch={handleSearch}
            availableFilters={searchFilters}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="bg-background/50 border-white/10 hover:bg-white/20"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? t("search.allCategories") : category}
              </Button>
            ))}
          </div>
        </div>

        <motion.div
          className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground text-center col-span-full">{t('noPostsFound')}</p>
          ) : (
            filteredPosts.map(post => (
              // --- The Fix is Here ---
              // We only render the Link if post.slug exists.
              post.slug ? (
                <AnimatedCard key={post.id}>
                  <Link href={`/${locale}/blog/${post.slug}`} className="block h-full">
                    <Card className="h-full flex flex-col transition-all duration-300 ease-in-out
                                                    bg-background/40 hover:bg-background/60 border-white/10
                                                    backdrop-blur-md group cursor-pointer"
                      style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}>

                      {post.featuredImage && (
                        <div className="overflow-hidden h-48">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <CardHeader>
                        <div className="flex items-center gap-2">
                          {post.featured && <Badge variant="secondary">{t('card.featured')}</Badge>}
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <p className="text-muted-foreground mb-4 text-sm flex-grow">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                        <div className="flex items-center text-primary mt-4 text-sm font-semibold">
                          {t('readMore')}
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2'}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ) : null // If no slug, don't render the card for now.
            ))
          )}
        </motion.div>
      </div>
    </section>
  )
}
