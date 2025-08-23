import { getTranslations } from 'next-intl/server';
import { getSiteSettingsAction } from '@/app/actions';
import WhyChooseUsContent from './WhyChooseUsContent';

export default async function WhyChooseUsSection() {
  const t = await getTranslations('WhyChooseUsSection');
  const settings = await getSiteSettingsAction();

  return (
    <section id="why-us" className="bg-background">
      <div className="container mx-auto px-4 py-10">
        <WhyChooseUsContent settings={settings} />
      </div>
    </section>
  );
}