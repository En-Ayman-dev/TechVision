// src/components/landing/WhyChooseUsClient.tsx
"use client"; // هذا المكون هو Client Component

import useCounter from '@/hooks/use-counter';
import type { SiteSettings } from '@/lib/types';
import { useTranslation } from 'react-i18next'; // استخدام useTranslation

// تعريف نوع الـ props التي سيستقبلها AnimatedStat
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

// تعريف نوع الـ props التي سيستقبلها WhyChooseUsClient
interface WhyChooseUsClientProps {
  settings: SiteSettings | null;
  // إزالة t من الـ props
  // t: (key: string) => string;
}

// المكون لم يعد يستقبل t كـ prop
export default function WhyChooseUsClient({ settings }: WhyChooseUsClientProps) { // إزالة t من الـ props
    // استخدام useTranslation مباشرة هنا
    const { t } = useTranslation('WhyChooseUsSection.stats'); // جلب الترجمة لـ namespace 'WhyChooseUsSection.stats'

    if (!settings) {
        return null; // Or return skeleton loaders
    }

    return (
        <>
            {/* استخدام t مباشرة مع المفتاح من الـ namespace المحدد */}
            <AnimatedStat value={settings.stats.satisfaction} label={t('satisfaction')} suffix="%" />
            <AnimatedStat value={settings.stats.projects} label={t('projects')} suffix="+" />
            <AnimatedStat value={settings.stats.experience} label={t('experience')} />
            <AnimatedStat value={settings.stats.team} label={t('team')} />
        </>
    )
}
