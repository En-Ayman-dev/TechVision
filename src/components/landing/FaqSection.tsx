import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from '@/lib/types';

const faqItems: FaqItem[] = [
  {
    question: "What is the typical project timeline?",
    answer: "Project timelines vary depending on the scope and complexity. A standard website may take 4-6 weeks, while a complex web application can take several months. We provide a detailed timeline after our initial consultation."
  },
  {
    question: "How do you handle project management?",
    answer: "We use agile methodologies and tools like Jira or Trello to manage projects. You'll have a dedicated project manager and regular check-ins to keep you updated on progress."
  },
  {
    question: "Do you provide support after the project is completed?",
    answer: "Yes, we offer various support and maintenance packages to ensure your application remains secure, updated, and running smoothly."
  },
  {
    question: "What technologies do you specialize in?",
    answer: "We specialize in modern web technologies including React, Next.js, Node.js, and various cloud platforms like AWS and Google Cloud. We choose the best tech stack for your specific needs."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            Have questions? We have answers.
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
