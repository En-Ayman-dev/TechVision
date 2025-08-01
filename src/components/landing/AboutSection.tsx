// src/components/landing/AboutSection.tsx
import Image from 'next/image';
// قم بإزالة: import { useTranslations } from 'next-intl';

// تعريف نوع الـ props التي سيستقبلها المكون
interface AboutSectionProps {
  t: (key: string) => string; // دالة الترجمة t
}

// المكون الآن يستقبل t كـ prop
export default function AboutSection({ t }: AboutSectionProps) {
  // لم نعد بحاجة لاستدعاء useTranslations هنا، لأن t تأتي كـ prop
  // const t = useTranslations('AboutSection');

  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
              {/* استخدام t مباشرة مع المفتاح الكامل من ملف الترجمة */}
              {t('AboutSection.title')}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t('AboutSection.paragraph')}
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-headline">{t('AboutSection.visionTitle')}</h3>
                <p className="text-muted-foreground">{t('AboutSection.visionText')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-headline">{t('AboutSection.valuesTitle')}</h3>
                <p className="text-muted-foreground">{t('AboutSection.valuesText')}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto">
            <Image
              src="https://placehold.co/600x400.png"
              alt={t('AboutSection.imageAlt')}
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
