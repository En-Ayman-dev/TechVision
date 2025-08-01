import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function CtaSection() {
  const t = await getTranslations('CtaSection');

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
            <Link href="#contact" passHref>
              <Button size="lg" variant="secondary">
                {t('button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
