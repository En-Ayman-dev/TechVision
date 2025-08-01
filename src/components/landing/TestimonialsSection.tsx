// src/components/landing/TestimonialsSection.tsx
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// قم بإزالة: import { getTranslations } from 'next-intl/server';
import { getTestimonialsAction } from '@/app/actions';

// تعريف نوع الـ props التي سيستقبلها المكون
interface TestimonialsSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

// المكون الآن يستقبل t كـ prop
export default async function TestimonialsSection({ t }: TestimonialsSectionProps) {
  // لم نعد بحاجة لاستدعاء getTranslations هنا
  // const t = await getTranslations('TestimonialsSection'); // هذا كان من next-intl/server
  const testimonials = await getTestimonialsAction();

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('TestimonialsSection.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('TestimonialsSection.subtitle')}
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
                    {/*
                      ملاحظة: إذا كانت testimonial.quote و testimonial.author و testimonial.role
                      تأتي من ملفات الترجمة (JSON) وليس من بيانات ثابتة،
                      فستحتاج إلى استخدام t() عليها أيضًا.
                      بناءً على الكود الحالي، يبدو أنها تأتي مباشرة من `getTestimonialsAction()`.
                    */}
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
