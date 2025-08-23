"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export default function CtaSection() {
  const t = useTranslations('CtaSection');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2, // تأخير بسيط بين العناصر
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="cta" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <motion.div
          className="mx-auto max-w-4xl text-center py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight font-headline sm:text-4xl"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-primary-foreground/80"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>
          <motion.div
            className="mt-8"
            variants={itemVariants}
          >
            <Link href="#contact" passHref>
              <Button size="lg" variant="secondary">
                {t('button')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}