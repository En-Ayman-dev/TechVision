import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function AboutSection() {
  const t = await getTranslations('AboutSection');

  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t('paragraph')}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-headline">{t('visionTitle')}</h3>
                <p className="text-muted-foreground">{t('visionText')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-headline">{t('valuesTitle')}</h3>
                <p className="text-muted-foreground">{t('valuesText')}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto">
            <Image
              src="/image/About.png" // تأكد من أن المسار صحيح
              alt={t('imageAlt')}
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              data-ai-hint="team collaboration"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
