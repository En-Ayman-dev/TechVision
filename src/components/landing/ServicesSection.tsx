"use client";

import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from "next-intl";
import { motion, useScroll, useTransform, Variants, useMotionValue, useSpring } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/lib/types";
import React, { useRef } from "react";
import { InteractiveParticles } from "@/components/ui/interactive-particles";
import Link from "next/link"; // 1. Import Link for navigation

// Define the component props interface
interface ServicesSectionProps {
  services: Service[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Code, Cloud, PenTool, Database, Shield, LineChart,
};

// Animation variants with explicit TypeScript type
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Reusable AnimatedCard component
const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 15 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div ref={ref} style={{ y }} className="w-full h-full" variants={itemVariants}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const t = useTranslations('ServicesSection');
  const locale = useLocale() as "en" | "ar"; // Get current locale
  const isLoading = services.length === 0;

  return (
    <section id="services" className="relative bg-background overflow-hidden">
      <InteractiveParticles />
      <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl" variants={itemVariants}>
            {t('title')}
          </motion.h2>
          <motion.p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground" variants={itemVariants}>
            {t('subtitle')}
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 rounded-xl bg-white/5" />
            ))
          ) : (
            services.map((service) => {
              const IconComponent = iconMap[service.icon] || Code;
              return (
                <AnimatedCard key={service.id}>
                  {/* 2. Card is now wrapped in a Link */}
                  <Link href={`/${locale}/services/${service.slug}`} className="block h-full">
                    <Card 
                      className="text-center h-full group transition-all duration-300 ease-in-out 
                                 bg-background/40 hover:bg-background/60 border-white/10
                                 backdrop-blur-md cursor-pointer"
                      style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
                    >
                      <CardHeader className="p-8 flex-grow flex flex-col">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/80 text-primary-foreground mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary" style={{transform: "translateZ(40px)"}}>
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-xl font-semibold leading-none tracking-tight font-headline group-hover:text-primary transition-colors" style={{transform: "translateZ(30px)"}}>
                          {service.title[locale]} {/* 3. Display content based on locale */}
                        </CardTitle>
                        <CardDescription className="mt-2 flex-grow" style={{transform: "translateZ(20px)"}}>
                          {service.description[locale]} {/* 3. Display content based on locale */}
                        </CardDescription>
                        
                        <div className="flex items-center justify-center text-primary mt-4 text-sm font-semibold" style={{transform: "translateZ(10px)"}}>
                            {t('learnMore')}
                            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2'}`} />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </AnimatedCard>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}
