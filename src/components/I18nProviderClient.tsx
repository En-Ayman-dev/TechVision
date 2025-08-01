// src/components/I18nProviderClient.tsx
"use client"; // هذا المكون هو Client Component

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n'; // استيراد مثيل i18n المهيأ لجانب العميل

interface I18nProviderClientProps {
  children: React.ReactNode;
  locale: string; // استقبال اللغة كـ prop
}

export default function I18nProviderClient({ children, locale }: I18nProviderClientProps) {
  useEffect(() => {
    // تغيير لغة i18n عندما تتغير الـ locale
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]); // إعادة تشغيل الـ effect عند تغير الـ locale

  return (
    // تأكد من أن هذا هو الكود الصحيح بدون أي أخطاء بناء جملة
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
