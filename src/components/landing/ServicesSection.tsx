import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useTranslations } from "next-intl";

export default function ServicesSection() {
  const t = useTranslations('ServicesSection');

  const services: Service[] = [
    {
      icon: Code,
      title: t('services.web.title'),
      description: t('services.web.description'),
    },
    {
      icon: Cloud,
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
    },
    {
      icon: PenTool,
      title: t('services.design.title'),
      description: t('services.design.description'),
    },
    {
      icon: Database,
      title: t('services.data.title'),
      description: t('services.data.description'),
    },
    {
      icon: Shield,
      title: t('services.security.title'),
      description: t('services.security.description'),
    },
    {
      icon: LineChart,
      title: t('services.analytics.title'),
      description: t('services.analytics.description'),
    },
  ];

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
          {services.map((service) => (
            <Card key={service.title} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
