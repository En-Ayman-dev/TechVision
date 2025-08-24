"use client";
import type { Partner } from '@/lib/types';
import { Globe, CircuitBoard, Rocket, Bot, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";

// Define the component props interface
interface PartnersSectionProps {
  partners: Partner[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Globe,
  CircuitBoard,
  Rocket,
  Bot,
  Building,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // تأخير بسيط بين ظهور كل شعار
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const t = useTranslations('PartnersSection');
  const isLoading = partners.length === 0;

  return (
    <section id="partners" className="bg-secondary/50">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            className="text-center text-lg font-semibold leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h2>
          <motion.div
            className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {isLoading ? (
              // Use isLoading to show skeleton loaders
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              partners.map((partner) => {
                const IconComponent = iconMap[partner.logo] || Globe;
                return (
                  <motion.div key={partner.id} variants={itemVariants}>
                    <div className="flex flex-col items-center justify-center text-center">
                      <IconComponent className="h-12 w-12 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                      <span className="mt-2 text-sm font-medium text-muted-foreground">{partner.name}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}