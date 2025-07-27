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

const testimonials: Testimonial[] = [
  {
    quote: "TechVision transformed our business. Their team is professional, knowledgeable, and dedicated to delivering results. We couldn't be happier with our new platform.",
    author: 'Alex Johnson',
    role: 'CEO, InnovateCorp',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "happy client"
  },
  {
    quote: "The best tech partner we've ever worked with. Their attention to detail and commitment to quality is unparalleled. Highly recommended!",
    author: 'Sarah Lee',
    role: 'CTO, QuantumLeap',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "satisfied customer"
  },
  {
    quote: "From UI/UX design to backend development, TechVision delivered excellence at every stage. They are true experts in their field.",
    author: 'David Chen',
    role: 'Founder, Stellar Solutions',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "smiling person"
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">What Our Clients Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            We've helped businesses of all sizes achieve their goals. Here's what they have to say.
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
