"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from '@/lib/types';
import { InteractiveParticles } from "@/components/ui/interactive-particles";

// Define the component props interface
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('TestimonialsSection');
  const isLoading = testimonials.length === 0;

  return (
    // 1. Main container with relative positioning for z-index context
    <section id="testimonials" className="relative bg-background overflow-hidden">
      <InteractiveParticles />
      {/* 2. Content container with z-10 to ensure it's above the particles */}
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
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

        {isLoading ? (
          <div className="w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="w-full h-80 rounded-xl bg-white/5" />
            <Skeleton className="w-full h-80 rounded-xl bg-white/5 hidden md:block" />
            <Skeleton className="w-full h-80 rounded-xl bg-white/5 hidden lg:block" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerVariants}
            className="w-full max-w-5xl mx-auto mt-12"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-6">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3 group">
                    <motion.div variants={itemVariants} className="p-1 h-full">
                      {/* 3. Card with glassmorphism and hover animation */}
                      <Card className="h-full flex flex-col transition-transform duration-300 ease-in-out group-hover:-translate-y-2
                                       bg-background/40 border-white/10 backdrop-blur-md">
                        <CardContent className="flex flex-col items-center text-center p-8 flex-grow">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="rounded-full mb-4 border-2 border-white/10 transition-transform duration-300 group-hover:scale-110"
                            data-ai-hint={testimonial.dataAiHint}
                          />
                          <p className="text-lg italic text-foreground mb-4 flex-grow">"{testimonial.quote}"</p>
                          <div className="mt-auto">
                            <h3 className="font-semibold text-lg font-headline">{testimonial.author}</h3>
                            <p className="text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* 4. Buttons are now visible and styled correctly */}
              <CarouselPrevious className="bg-background/50 border-white/20 hover:bg-white/20" />
              <CarouselNext className="bg-background/50 border-white/20 hover:bg-white/20" />
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
}
