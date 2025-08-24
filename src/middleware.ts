import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  // Add manifest.json to the exclusion list
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)'],
};