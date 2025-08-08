
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The locale prefix strategy. 'as-needed' is the default.
  // It means that the default locale will not have a prefix in the URL.
  // Example: /en/about will be /about
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};