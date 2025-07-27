
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart, type LucideProps, type LucideIcon } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useTranslations } from "next-intl";
import { getServicesAction } from "@/app/actions";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  PenTool,
  Database,
  Shield,
  LineChart,
};

export default function ServicesSection() {
  const t = useTranslations('ServicesSection');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      const fetchedServices = await getServicesAction();
      setServices(fetchedServices);
      setIsLoading(false);
    }
    loadServices();
  }, []);

  return (
    <section id="services" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full mx-auto" />
                    <Skeleton className="h-4 w-5/6 mx-auto" />
                </CardHeader>
              </Card>
            ))
          ) : (
            services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code;
              return (
                <Card key={service.title} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
