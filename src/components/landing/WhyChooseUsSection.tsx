// src/components/landing/WhyChooseUsSection.tsx
import { BadgeCheck, Zap, Users } from 'lucide-react';
// قم بإزالة: import { getTranslations } from 'next-intl/server'; // هذا السطر يجب أن يكون قد أزيل سابقًا
import { getSiteSettingsAction } from '@/app/actions';
import WhyChooseUsClient from './WhyChooseUsClient';

// تعريف نوع الـ props التي سيستقبلها المكون
interface WhyChooseUsSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

// المكون الآن يستقبل t كـ prop
export default async function WhyChooseUsSection({ t }: WhyChooseUsSectionProps) {
  // لم نعد بحاجة لاستدعاء getTranslations هنا
  // const t = await getTranslations('WhyChooseUsSection'); // هذا كان من next-intl/server
  const settings = await getSiteSettingsAction();

  return (
    <section id="why-us" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('WhyChooseUsSection.title')}</h2>
            <p className="mt-4 text-muted-foreground">
              {t('WhyChooseUsSection.subtitle')}
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <BadgeCheck className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('WhyChooseUsSection.reasons.quality.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('WhyChooseUsSection.reasons.quality.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('WhyChooseUsSection.reasons.agile.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('WhyChooseUsSection.reasons.agile.description')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold">{t('WhyChooseUsSection.reasons.customer.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('WhyChooseUsSection.reasons.customer.description')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center bg-secondary/50 p-8 rounded-lg">
            {/* لا نمرر t إلى WhyChooseUsClient هنا */}
            <WhyChooseUsClient settings={settings} /> {/* إزالة t={t} */}
          </div>
        </div>
      </div>
    </section>
  );
}
