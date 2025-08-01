// src/components/landing/PortfolioSection.tsx
"use client"; // هذا المكون هو Client Component

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';
import { getProjectsAction } from '@/app/actions';
import { useTranslation } from 'react-i18next'; // استخدام useTranslation
import { Skeleton } from '../ui/skeleton';

// إزالة تعريف الـ props التي تستقبل t
// interface PortfolioSectionProps { t: (key: string) => string; }

// This component remains a client component because it has interactive filtering logic.
// However, the initial data fetching could be passed as a prop from a server parent
// in a more complex app to optimize initial load. For this case, fetching on client is acceptable.

// المكون لم يعد يستقبل t كـ prop
export default function PortfolioSection() { // إزالة { t }: PortfolioSectionProps
  // استخدام useTranslation مباشرة هنا
  const { t } = useTranslation('PortfolioSection'); // جلب الترجمة لـ namespace 'PortfolioSection'

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      const projects = await getProjectsAction();
      setAllProjects(projects);
      setIsLoading(false);
    }
    loadProjects();
  }, []);
  
  const categories = useMemo(() => {
    if (isLoading) return [];
    
    const projectCategories = [...new Set(allProjects.map(p => p.category.toLowerCase()))];
    
    const translatedCategories: Record<string, string> = {
        all: t('categories.all'), // استخدام المفتاح من الـ namespace المحدد
    };

    projectCategories.forEach(key => {
        // محاولة جلب الترجمة لكل فئة، أو استخدام القيمة الأصلية مع تنسيق
        translatedCategories[key] = t(`categories.${key}`) || key.charAt(0).toUpperCase() + key.slice(1);
    });

    return Object.entries(translatedCategories).map(([key, value]) => ({ key, value }));

  }, [isLoading, allProjects, t]); // إضافة t إلى dependencies array

  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    if (categories.length > 0) {
      setFilter('all');
    }
  }, [categories]);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return allProjects;
    return allProjects.filter((project) => project.category.toLowerCase() === filter);
  }, [filter, allProjects]);

  return (
    <section id="portfolio" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-8 flex justify-center flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={filter === category.key ? 'default' : 'outline'}
              onClick={() => setFilter(category.key)}
            >
              {category.value}
            </Button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden group">
                    <CardContent className="p-0">
                        <Skeleton className="w-full h-[250px]" />
                        <div className="p-6">
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <Skeleton className="mt-2 h-4 w-full rounded-md" />
                        </div>
                    </CardContent>
                </Card>
              ))
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={project.dataAiHint}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold font-headline">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
