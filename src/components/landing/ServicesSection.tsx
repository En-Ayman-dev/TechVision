import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart } from 'lucide-react';
import { getTranslations } from "next-intl/server";
import { getServicesAction } from "@/app/actions";

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  PenTool,
  Database,
  Shield,
  LineChart,
};

export default async function ServicesSection() {
  const t = await getTranslations('ServicesSection');
  const services = await getServicesAction();

  return (
    <section id="services" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <Card key={service.id} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
