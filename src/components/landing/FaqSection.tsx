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

  const faqItems: FaqItem[] = [
    {
      question: t('items.q1'),
      answer: t('items.a1')
    },
    {
      question: t('items.q2'),
      answer: t('items.a2')
    },
    {
      question: t('items.q3'),
      answer: t('items.a3')
    },
    {
      question: t('items.q4'),
      answer: t('items.a4')
    }
  ];

  return (
    <section id="faq" className="bg-background">
      <div className="container mx-auto px-4">
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
