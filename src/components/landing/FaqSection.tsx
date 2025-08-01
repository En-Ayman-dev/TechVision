// src/components/landing/FaqSection.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from '@/lib/types';
// قم بإزالة: import { useTranslations } from "next-intl";

// تعريف نوع الـ props التي سيستقبلها المكون
interface FaqSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

// المكون الآن يستقبل t كـ prop
export default function FaqSection({ t }: FaqSectionProps) {
  // لم نعد بحاجة لاستدعاء useTranslations هنا
  // const t = useTranslations('FaqSection');
  // const tItems = useTranslations('FaqSection.items'); // هذا أيضًا لم يعد ضروريًا

  const keys = ['q1', 'q2', 'q3', 'q4'] as const;
  
  const faqItems: FaqItem[] = keys.map(key => ({
      // استخدام t مباشرة مع المفتاح الكامل من ملف الترجمة
      question: t(`FaqSection.items.${key}`),
      answer: t(`FaqSection.items.${key.replace('q', 'a')}`)
  }));

  return (
    <section id="faq" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('FaqSection.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('FaqSection.subtitle')}
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
