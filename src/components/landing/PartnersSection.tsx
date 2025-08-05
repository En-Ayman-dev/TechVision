import type { Partner } from '@/lib/types';
import { Globe, CircuitBoard, Rocket, Bot, Building } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getPartnersAction } from '@/app/actions';

const iconMap: { [key: string]: React.ElementType } = {
  Globe,
  CircuitBoard,
  Rocket,
  Bot,
  Building,
};

export default async function PartnersSection() {
  const t = await getTranslations('PartnersSection');
  const partners = await getPartnersAction();

  return (
    <section id="partners" className="bg-secondary/50">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-lg font-semibold leading-8 text-muted-foreground">
            {t('title')}
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {partners.map((partner) => {
              const IconComponent = iconMap[partner.logo] || Globe;
              return (
                <div key={partner.id} className="flex flex-col items-center justify-center text-center">
                  <IconComponent className="h-12 w-12 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                  <span className="mt-2 text-sm font-medium text-muted-foreground">{partner.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
