

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locales.includes(locale!)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Riyadh', 
    now: new Date() 
  };
});
