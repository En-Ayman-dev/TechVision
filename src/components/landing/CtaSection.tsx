import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function CtaSection() {
  const t = useTranslations('CtaSection');
  return (
    <section id="cta" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center py-16">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {t('subtitle')}
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#contact">{t('button')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
