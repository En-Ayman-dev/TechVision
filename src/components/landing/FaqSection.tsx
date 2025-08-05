import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from '@/lib/types';
import { useTranslations } from "next-intl";

export default function FaqSection() {
  const t = useTranslations('FaqSection');

  const keys = ['q1', 'q2', 'q3', 'q4'] as const;
  
  const faqItems: FaqItem[] = keys.map(key => ({
      question: t(`items.${key}`),
      answer: t(`items.${key.replace('q', 'a')}`)
  }));

  return (
    <section id="faq" className="bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
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
