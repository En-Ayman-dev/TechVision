
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
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from '@/lib/types';

// Define the component props interface
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('TestimonialsSection');


  const isLoading = testimonials.length === 0;

  return (
    <section id="testimonials" className="bg-background">
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

        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto mt-12 flex gap-4">
            <Skeleton className="w-full h-80" />
            <Skeleton className="w-full h-80 hidden md:block" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerVariants}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto mt-12"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div key={index} variants={itemVariants} className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center text-center p-8">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            width={80}
                            height={80}
                            className="rounded-full mb-4"
                            data-ai-hint={testimonial.dataAiHint}
                          />
                          <p className="text-lg italic text-foreground mb-4">"{testimonial.quote}"</p>
                          <h3 className="font-semibold text-lg font-headline">{testimonial.author}</h3>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
}