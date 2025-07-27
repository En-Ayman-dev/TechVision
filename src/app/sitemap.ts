import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'ar'];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const sitemapEntries = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
  }));

  return sitemapEntries;
}
