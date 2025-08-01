// src/components/landing/ServicesSection.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart } from 'lucide-react';
// قم بإزالة: import { getTranslations } from "next-intl/server";
import { getServicesAction } from "@/app/actions";

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  PenTool,
  Database,
  Shield,
  LineChart,
};

// تعريف نوع الـ props التي سيستقبلها المكون
interface ServicesSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

// المكون الآن يستقبل t كـ prop
export default async function ServicesSection({ t }: ServicesSectionProps) {
  // لم نعد بحاجة لاستدعاء getTranslations هنا
  // const t = await getTranslations('ServicesSection'); // هذا كان من next-intl/server
  const services = await getServicesAction();

  return (
    <section id="services" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('ServicesSection.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('ServicesSection.subtitle')}
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
                  {/*
                    ملاحظة: إذا كانت service.title و service.description
                    تأتي من ملفات الترجمة (JSON) وليس من بيانات ثابتة،
                    فستحتاج إلى استخدام t() عليها أيضًا.
                    على سبيل المثال:
                    <CardTitle className="font-headline">{t(`ServicesSection.items.${service.id}.title`)}</CardTitle>
                    <CardDescription>{t(`ServicesSection.items.${service.id}.description`)}</CardDescription>
                    ولكن بناءً على الكود الحالي، يبدو أنها تأتي مباشرة من `getServicesAction()`.
                  */}
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
