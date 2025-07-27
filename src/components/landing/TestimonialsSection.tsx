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

export default function TestimonialsSection() {
  const t = useTranslations('TestimonialsSection');

  const testimonials: Testimonial[] = [
    {
      quote: t('testimonials.alex.quote'),
      author: t('testimonials.alex.author'),
      role: t('testimonials.alex.role'),
      image: 'https://placehold.co/100x100.png',
      dataAiHint: "happy client"
    },
    {
      quote: t('testimonials.sarah.quote'),
      author: t('testimonials.sarah.author'),
      role: t('testimonials.sarah.role'),
      image: 'https://placehold.co/100x100.png',
      dataAiHint: "satisfied customer"
    },
    {
      quote: t('testimonials.david.quote'),
      author: t('testimonials.david.author'),
      role: t('testimonials.david.role'),
      image: 'https://placehold.co/100x100.png',
      dataAiHint: "smiling person"
    },
  ];

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
            {testimonials.map((testimonial, index) => (
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
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
