"use client";

import { BadgeCheck, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import WhyChooseUsClient from './WhyChooseUsClient';
import type { SiteSettings } from '@/lib/types';

interface WhyChooseUsContentProps {
  settings: SiteSettings | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function WhyChooseUsContent({ settings }: WhyChooseUsContentProps) {
  const t = useTranslations('WhyChooseUsSection');

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <motion.div
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
          className="mt-4 text-muted-foreground"
          variants={itemVariants}
        >
          {t('subtitle')}
        </motion.p>
        <motion.ul
          className="mt-6 space-y-4"
          variants={containerVariants}
        >
          <motion.li className="flex items-start gap-3" variants={itemVariants}>
            <BadgeCheck className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">{t('reasons.quality.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('reasons.quality.description')}</p>
            </div>
          </motion.li>
          <motion.li className="flex items-start gap-3" variants={itemVariants}>
            <Zap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">{t('reasons.agile.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('reasons.agile.description')}</p>
            </div>
          </motion.li>
          <motion.li className="flex items-start gap-3" variants={itemVariants}>
            <Users className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">{t('reasons.customer.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('reasons.customer.description')}</p>
            </div>
          </motion.li>
        </motion.ul>
      </motion.div>
      <div className="grid grid-cols-2 gap-8 text-center bg-secondary/50 p-8 rounded-lg">
        <WhyChooseUsClient settings={settings} />
      </div>
    </div>
  );
}