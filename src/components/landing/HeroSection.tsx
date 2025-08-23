
"use client";

import { motion } from "framer-motion";
import { easeOut } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function HeroSection() {
  const t = useTranslations("HeroSection");

  // تعريف متغيرات الأنيميشن
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // تأخير بين ظهور العناصر الفرعية
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <section id="hero-section" className="relative">
      <div className="container relative z-10 mx-auto px-4 py-16 text-center lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants ? itemVariants : undefined}
            className="text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg md:text-xl"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-8 flex justify-center space-x-4"
          >
            <Link href="#contact-section" passHref>
              <Button size="lg" className="rounded-full">
                {t("exploreServices")}
              </Button>
            </Link>
            <Link href="#projects-section" passHref>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                {t("seeOurWork")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}