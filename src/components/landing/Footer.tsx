import Link from 'next/link';
import { Code, Twitter, Linkedin, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">{t('companyName')}</span>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground border-t pt-8">
          <p>&copy; {new Date().getFullYear()} {t('companyName')}. {t('rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
