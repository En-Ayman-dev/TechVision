
// import createWithIntl from 'next-intl/plugin';
// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//         domains: ['res.cloudinary.com'], // ✅ السماح بتحميل الصور من Cloudinary

//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'github.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'i.imgur.com', // مهم جدًا! Imgur يعرض الصور عبر i.imgur.com
//       },
//     ],
//   },
// };

// const withIntl = createWithIntl('./src/i18n.ts');

// export default withIntl(nextConfig);


import createWithIntl from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // السماح بتحميل الصور من Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
 async rewrites() {
    return [
      {
        source: '/ar/image/:path*',
        destination: '/image/:path*',
      },
    ];
  },
};

const withIntl = createWithIntl('./src/i18n.ts');

export default withIntl(nextConfig);
