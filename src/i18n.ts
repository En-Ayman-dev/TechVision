// import {notFound} from 'next/navigation';
// import {getRequestConfig} from 'next-intl/server';
 
// const locales = ['en', 'ar'];
 
// export default getRequestConfig(async ({locale}) => {
//   if (!locales.includes(locale as any)) {
//     notFound();
//   }
 
//   return {
//     messages: (await import(`../messages/${locale}.json`)).default,
//     locale,
//   };
// });
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => { // <--- تم التعديل هنا
  // هذا عادة ما يتوافق مع الجزء `[locale]` في المسار
  let locale = await requestLocale; // <--- تم التعديل هنا

  // التأكد من أن اللغة الواردة صالحة
  if (!locales.includes(locale as any)) { // <--- استخدام مصفوفة اللغات الخاصة بك
    notFound(); // أو قم بتعيين لغة افتراضية إذا كان لديك واحدة، مثل 'en'
    // مثال لتعيين لغة افتراضية: locale = 'en';
  }

  return {
    locale, // <--- تمرير اللغة النهائية
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});