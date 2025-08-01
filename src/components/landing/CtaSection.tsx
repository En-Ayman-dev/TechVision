// src/components/landing/CtaSection.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// قم بإزالة: import { useTranslations } from 'next-intl';

// تعريف نوع الـ props التي سيستقبلها المكون
interface CtaSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

export default function CtaSection({ t }: CtaSectionProps) {


  return (
    <section id="cta" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center py-16">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            {t('CtaSection.title')}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {t('CtaSection.subtitle')}
          </p>
          <div className="mt-8">
            <Link href="#contact" passHref>
              <Button size="lg" variant="secondary">
                {t('CtaSection.button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
