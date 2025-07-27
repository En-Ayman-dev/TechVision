
"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';
import { getProjectsAction } from '@/app/actions';
import { useTranslations } from 'next-intl';

export default function PortfolioSection() {
  const t = useTranslations('PortfolioSection');
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
    return [t('categories.all'), ...Array.from(new Set(allProjects.map(p => p.category)))];
  }, [isLoading, allProjects, t]);

  const [filter, setFilter] = useState(t('categories.all'));
  
  // Set filter to "All" once categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      setFilter(t('categories.all'));
    }
  }, [categories, t]);

  const filteredProjects = useMemo(() => {
    if (filter === t('categories.all')) return allProjects;
    return allProjects.filter((project) => project.category === filter);
  }, [filter, allProjects, t]);

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
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden group">
                    <CardContent className="p-0">
                        <div className="w-full h-[250px] bg-muted animate-pulse" />
                        <div className="p-6">
                            <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md" />
                            <div className="mt-2 h-4 w-full bg-muted animate-pulse rounded-md" />
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
