"use client";

import useCounter from '@/hooks/use-counter';
import { BadgeCheck, Zap, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

const AnimatedStat = ({ value, label, suffix = '' }: { value: number, label: string, suffix?: string }) => {
  const { count, ref } = useCounter(value, 2000);
  return (
    <div className="flex flex-col items-center">
      <span ref={ref} className="text-4xl font-bold text-primary tracking-tighter">
        {count}{suffix}
      </span>
      <p className="text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export default function WhyChooseUsSection() {
  const t = useTranslations('WhyChooseUsSection');

  return (
    <section id="why-us" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
            <p className="mt-4 text-muted-foreground">
              {t('subtitle')}
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <BadgeCheck className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('reasons.quality.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('reasons.quality.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('reasons.agile.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('reasons.agile.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('reasons.customer.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('reasons.customer.description')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center bg-secondary/50 p-8 rounded-lg">
            <AnimatedStat value={98} label={t('stats.satisfaction')} suffix="%" />
            <AnimatedStat value={150} label={t('stats.projects')} suffix="+" />
            <AnimatedStat value={12} label={t('stats.experience')} />
            <AnimatedStat value={42} label={t('stats.team')} />
          </div>
        </div>
      </div>
    </section>
  );
}
