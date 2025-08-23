"use client";

import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart } from 'lucide-react';
import { useTranslations } from "next-intl";
import { getServicesAction } from "@/app/actions";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/lib/types";

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  PenTool,
  Database,
  Shield,
  LineChart,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServicesSection() {
  const t = useTranslations('ServicesSection');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const fetchedServices = await getServicesAction();
      setServices(fetchedServices);
      setIsLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="bg-background">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight font-headline sm:text-4xl"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {isLoading ? (
            // Show skeleton loaders while data is being fetched
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-lg" />
            ))
          ) : (
            services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code;
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-semibold leading-none tracking-tight font-headline">
                        {service.title}
                      </h3>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}