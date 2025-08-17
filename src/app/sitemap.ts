// import { MetadataRoute } from 'next';

// export default function sitemap(): MetadataRoute.Sitemap {
//   const locales = ['en', 'ar'];
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

//   const sitemapEntries = locales.map((locale) => ({
//     url: `${baseUrl}/${locale}`,
//     lastModified: new Date(),
//   }));

//   return sitemapEntries;
// }


import { MetadataRoute } from 'next';
import { getProjectsAction, getBlogPostsAction } from './actions';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const t = await getTranslations();
  const projects = await getProjectsAction();
  const blogPosts = await getBlogPostsAction();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tech-vision-ayman.vercel.app';

  const defaultLastModified = new Date();

  // Define static routes
  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: defaultLastModified,
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/services`,
      lastModified: defaultLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/portfolio`,
      lastModified: defaultLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: defaultLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/contact`,
      lastModified: defaultLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${locale}/admin`,
      lastModified: defaultLastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]);

  // Define dynamic routes from data
  const dynamicRoutes = [
    ...projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: defaultLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : defaultLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}