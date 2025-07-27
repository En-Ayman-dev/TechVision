"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PortfolioItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function PortfolioSection() {
  const t = useTranslations('PortfolioSection');

  const allProjects: PortfolioItem[] = [
    { id: 1, category: t('categories.web'), title: t('projects.ecommerce.title'), image: 'https://placehold.co/600x400.png', description: t('projects.ecommerce.description'), dataAiHint: "ecommerce website" },
    { id: 2, category: t('categories.cloud'), title: t('projects.cloud.title'), image: 'https://placehold.co/600x400.png', description: t('projects.cloud.description'), dataAiHint: "cloud servers" },
    { id: 3, category: t('categories.design'), title: t('projects.design.title'), image: 'https://placehold.co/600x400.png', description: t('projects.design.description'), dataAiHint: "mobile app" },
    { id: 4, category: t('categories.data'), title: t('projects.data.title'), image: 'https://placehold.co/600x400.png', description: t('projects.data.description'), dataAiHint: "dashboard chart" },
    { id: 5, category: t('categories.web'), title: t('projects.corp.title'), image: 'https://placehold.co/600x400.png', description: t('projects.corp.description'), dataAiHint: "corporate website" },
    { id: 6, category: t('categories.security'), title: t('projects.security.title'), image: 'https://placehold.co/600x400.png', description: t('projects.security.description'), dataAiHint: "cyber security" },
  ];
  
  const categories = [t('categories.all'), t('categories.web'), t('categories.cloud'), t('categories.design'), t('categories.data'), t('categories.security')];

  const [filter, setFilter] = useState(t('categories.all'));

  const filteredProjects = useMemo(() => {
    if (filter === t('categories.all')) return allProjects;
    return allProjects.filter((project) => project.category === filter);
  }, [filter, t]);

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
          {filteredProjects.map((project) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
