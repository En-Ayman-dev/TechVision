import { BadgeCheck, Zap, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getSiteSettingsAction } from '@/app/actions';
import WhyChooseUsClient from './WhyChooseUsClient';

export default async function WhyChooseUsSection() {
  const t = await getTranslations('WhyChooseUsSection');
  const settings = await getSiteSettingsAction();

  return (
    <section id="why-us" className="bg-background">
      <div className="container mx-auto px-4 py-10">
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
            <WhyChooseUsClient settings={settings} />
          </div>
        </div>
      </div>
    </section>
  );
}
