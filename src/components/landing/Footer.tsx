
import Image from 'next/image';
import Link from 'next/link';
import { Code, Twitter, Linkedin, Github, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const resources = [
    {
      href: 'https://stackoverflow.com/',
      title: 'Stack Overflow',
      description: 'أكبر منصة أسئلة وإجابات للمطورين',
      logo: '/image/logos/stackoverflow.png'
    },
    {
      href: 'https://developers.google.com/',
      title: 'Google Developers',
      description: 'مركز أدوات ومصادر Google للمطورين',
      logo: '/image/logos/google-developers.png'
    },
    {
      href: 'https://owasp.org/',
      title: 'OWASP',
      description: 'مشروع عالمي لموارد أمان التطبيقات',
      logo: '/image/logos/owasp.png'
    },
    {
      href: 'https://cbinsights.com/',
      title: 'CB Insights',
      description: 'منصة ذكاء أعمال وتحليل السوق',
      logo: '/image/logos/cb-insights.png'
    },
    {
      href: 'https://www.thehackernews.com/',
      title: 'The Hacker News',
      description: 'أخبار وتحديثات الأمن السيبراني الموثوقة',
      logo: '/image/logos/hacker-news.png'
    },
    {
      href: 'https://www.kdnuggets.com/',
      title: 'KDnuggets',
      description: 'مصدر رائد لتحليلات البيانات والتعلم الآلي',
      logo: '/image/logos/kdnuggets.png'
    },
    {
      href: 'https://www.kaggle.com/',
      title: 'Kaggle',
      description: 'منصة مسابقات البيانات والتعلم العميق',
      logo: '/image/logos/kaggle.png'
    }
  ];

  return (
    <footer className="bg-background border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-muted-foreground">

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg font-headline text-foreground">{t('companyName')}</span>
            </div>
            <p className="text-sm leading-relaxed">
              {t('aboutParagraph')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('importantLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary">{t('home')}</Link></li>
              <li><Link href="/about" className="hover:text-primary">{t('about')}</Link></li>
              <li><Link href="/services" className="hover:text-primary">{t('services')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Vision and Values */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('visionTitle')}</h4>
            <p className="text-sm leading-relaxed mb-2">{t('visionText')}</p>
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('valuesTitle')}</h4>
            <p className="text-sm">{t('valuesText')}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('contactTitle')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:ayman.alzhabi.dev@gmail.com"
                  className="hover:text-primary"
                >
                  ayman.alzhabi.dev@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+967774998429"
                  className="hover:text-primary"
                >
                  +967 774 998 429
                </a>
              </li>
            </ul>

            <div className="flex gap-4 mt-4">
              <Link href="https://twitter.com" className="hover:text-primary" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
              <Link href="https://linkedin.com" className="hover:text-primary" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
              <Link href="https://github.com" className="hover:text-primary" aria-label="Github"><Github className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        {/* Resource Section */}
        <div className="mt-12 pt-8 border-t text-muted-foreground text-sm">
          <h4 className="font-semibold mb-6">{t('resourcesTitle')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {resources.map((res) => (
              <Link
                key={res.href}
                href={res.href}
                target="_blank"
                className="group flex items-start gap-3 hover:bg-gray-100 p-2 rounded"
              // locale={false}

              >
                <Image
                  src={res.logo}
                  alt={res.title}
                  width={32}
                  height={32}
                  className="object-contain rounded"
                  unoptimized
                />
                <div>
                  <div className="font-semibold group-hover:text-black">{res.title}</div>
                  <div className="text-xs group-hover:text-black">{res.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* حقوق */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('companyName')}. {t('rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
