import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('HeroSection');

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20rem] left-[-20rem] h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-20rem] right-[-20rem] h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[150px]" />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="py-20 md:py-32">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl md:text-6xl lg:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="#services">
                  {t('exploreServices')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#portfolio">
                  {t('seeOurWork')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
