// import { MetadataRoute } from 'next';

// export default function robots(): MetadataRoute.Robots {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    
//     return {
//         rules: {
//             userAgent: '*',
//             allow: '/',
//             disallow: '/admin/',
//         },
//         sitemap: `${baseUrl}/sitemap.xml`,
//     };
// }


import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://tech-vision-ayman.vercel.app/sitemap.xml',
  };
}