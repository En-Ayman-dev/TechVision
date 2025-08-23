
"use client";

import Image from 'next/image';
import { motion } from "framer-motion";
import { easeOut } from "framer-motion";
import { useTranslations } from 'next-intl';


export default function AboutSection() {
  const t = useTranslations('AboutSection');

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  return (
    <section id="about-section" className="container py-16 lg:py-24">
      <div className="grid gap-8 md:grid-cols-2 md:gap-16">
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="w-full h-auto">
            <Image
              src="/image/About.avif"
              alt={t('imageAlt')}
              width={600}
              height={400}
              unoptimized
              className="rounded-lg shadow-xl"
              priority
            />

          </div>
        </motion.div>
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {t('paragraph')}
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold font-headline">{t('visionTitle')}</h3>
              <p className="text-muted-foreground">{t('visionText')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-headline">{t('valuesTitle')}</h3>
              <p className="text-muted-foreground">{t('valuesText')}</p>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
