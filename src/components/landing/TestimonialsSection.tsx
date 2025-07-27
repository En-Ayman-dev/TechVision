
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
import type { Testimonial } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getTestimonialsAction } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';

export default function TestimonialsSection() {
  const t = useTranslations('TestimonialsSection');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      setIsLoading(true);
      const fetchedTestimonials = await getTestimonialsAction();
      setTestimonials(fetchedTestimonials);
      setIsLoading(false);
    }
    loadTestimonials();
  }, []);

  return (
    <section id="testimonials" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto mt-12"
        >
          <CarouselContent>
            {isLoading ? (
               Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex flex-col items-center text-center p-8">
                                <Skeleton className="h-20 w-20 rounded-full mb-4" />
                                <Skeleton className="h-5 w-full mb-4" />
                                <Skeleton className="h-5 w-3/4 mb-4" />
                                <Skeleton className="h-6 w-1/3 mb-1" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
               ))
            ) : (
                testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                    <div className="p-1">
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
                    </div>
                </CarouselItem>
                ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
