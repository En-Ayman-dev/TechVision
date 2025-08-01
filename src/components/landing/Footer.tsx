// src/components/landing/Footer.tsx
"use client"; // هذا المكون هو Client Component

import Link from 'next/link';
import { Code, Twitter, Linkedin, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // استخدام useTranslation

// إزالة تعريف الـ props التي تستقبل t
// interface FooterProps { t: (key: string) => string; }

// المكون لم يعد يستقبل t كـ prop
export default function Footer() { // إزالة { t }: FooterProps
  // استخدام useTranslation مباشرة هنا
  const { t } = useTranslation('Footer'); // جلب الترجمة لـ namespace 'Footer'
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            {/* استخدام t مباشرة مع المفتاح من الـ namespace المحدد */}
            <span className="font-bold text-lg font-headline">{t('companyName')}</span>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Follow us on Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Follow us on LinkedIn"><Linkedin className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Check out our Github"><Github className="h-5 w-5" /></Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground border-t pt-8">
          {/* استخدام t مباشرة مع المفتاح من الـ namespace المحدد */}
          <p>&copy; {new Date().getFullYear()} {t('companyName')}. {t('rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
