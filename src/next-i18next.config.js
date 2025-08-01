// next-i18next.config.js
// const path = require('path'); // إذا كان موجودًا قم بإزالته

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
  },
  // تأكد من إزالة هذا السطر إذا كان موجودًا:
  // localePath: path.resolve('./public/locales'),
};