"use client";

import useCounter from '@/hooks/use-counter';
import type { SiteSettings } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
}

const AnimatedStat = ({ value, label, suffix = '' }: AnimatedStatProps) => {
  const { count, ref } = useCounter(value, 2000);
  return (
    <div className="flex flex-col items-center">
      <span ref={ref} className="text-4xl font-bold text-primary tracking-tighter">
        {count}{suffix}
      </span>
      <p className="text-muted-foreground mt-1 text-center">{label}</p>
    </div>
  );
};

interface WhyChooseUsClientProps {
  settings: SiteSettings | null;
}

export default function WhyChooseUsClient({ settings }: WhyChooseUsClientProps) {
  const t = useTranslations('WhyChooseUsSection.stats');

  if (!settings) {
    return null; // Or return skeleton loaders
  }

  return (
    <>
      <AnimatedStat value={settings.stats.satisfaction} label={t('satisfaction')} suffix="%" />
      <AnimatedStat value={settings.stats.projects} label={t('projects')} suffix="+" />
      <AnimatedStat value={settings.stats.experience} label={t('experience')} />
      <AnimatedStat value={settings.stats.team} label={t('team')} />
    </>
  )
}
