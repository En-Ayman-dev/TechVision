"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PortfolioItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const allProjects: PortfolioItem[] = [
  { id: 1, category: 'Web', title: 'E-commerce Platform', image: 'https://placehold.co/600x400.png', description: 'A scalable online store with a modern UI.', dataAiHint: "ecommerce website" },
  { id: 2, category: 'Cloud', title: 'Cloud Migration', image: 'https://placehold.co/600x400.png', description: 'Migrated legacy systems to a public cloud.', dataAiHint: "cloud servers" },
  { id: 3, category: 'Design', title: 'Mobile App UI/UX', image: 'https://placehold.co/600x400.png', description: 'Redesigned a popular fitness application.', dataAiHint: "mobile app" },
  { id: 4, category: 'Data', title: 'Analytics Dashboard', image: 'https://placehold.co/600x400.png', description: 'A real-time data visualization tool.', dataAiHint: "dashboard chart" },
  { id: 5, category: 'Web', title: 'Corporate Website', image: 'https://placehold.co/600x400.png', description: 'A sleek and professional site for a finance firm.', dataAiHint: "corporate website" },
  { id: 6, category: 'Security', title: 'Security Audit', image: 'https://placehold.co/600x400.png', description: 'Comprehensive security audit for a fintech startup.', dataAiHint: "cyber security" },
];

const categories = ['All', 'Web', 'Cloud', 'Design', 'Data', 'Security'];

export default function PortfolioSection() {
  const [filter, setFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return allProjects;
    return allProjects.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <section id="portfolio" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Our Work</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            We are proud of the solutions we've delivered. Explore some of our recent projects.
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
