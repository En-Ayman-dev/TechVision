

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ar'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;

  if (!locales.includes(locale!)) notFound();

  return {
    locale, 
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

// import { getRequestConfig } from 'next-intl/server';
// import { notFound } from 'next/navigation';

// export const locales = ['en', 'ar'];

// export default getRequestConfig(async ({ locale }) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!locales.includes(locale as any)) notFound();

//   return {
//     locale,
//     messages: (await import(`../messages/${locale}.json`)).default
//   };
// });