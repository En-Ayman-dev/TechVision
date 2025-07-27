import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section id="cta" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center py-16">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            Ready to Start Your Next Project?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Let's build something amazing together. Contact us today for a free consultation and quote.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
