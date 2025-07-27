
"use client";

import useCounter from '@/hooks/use-counter';
import { BadgeCheck, Zap, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getSiteSettingsAction } from '@/app/actions';
import type { SiteSettings } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

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
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const fetchedSettings = await getSiteSettingsAction();
      setSettings(fetchedSettings);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

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
            {isLoading || !settings ? (
              <>
                <div className="flex flex-col items-center"><Skeleton className="h-10 w-20 mb-1" /><Skeleton className="h-4 w-24" /></div>
                <div className="flex flex-col items-center"><Skeleton className="h-10 w-20 mb-1" /><Skeleton className="h-4 w-24" /></div>
                <div className="flex flex-col items-center"><Skeleton className="h-10 w-20 mb-1" /><Skeleton className="h-4 w-24" /></div>
                <div className="flex flex-col items-center"><Skeleton className="h-10 w-20 mb-1" /><Skeleton className="h-4 w-24" /></div>
              </>
            ) : (
              <>
                <AnimatedStat value={settings.stats.satisfaction} label={t('stats.satisfaction')} suffix="%" />
                <AnimatedStat value={settings.stats.projects} label={t('stats.projects')} suffix="+" />
                <AnimatedStat value={settings.stats.experience} label={t('stats.experience')} />
                <AnimatedStat value={settings.stats.team} label={t('stats.team')} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
