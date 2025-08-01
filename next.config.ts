// import type {NextConfig} from 'next';
// import { i18n } from './src/next-i18next.config';

// const nextConfig: NextConfig = {
//   // output: 'export',
//   /* config options here */
//     i18n,

//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;
import type {NextConfig} from 'next';
// قم بإزالة هذا السطر: import { i18n } from './src/next-i18next.config';

const nextConfig: NextConfig = {
  // output: 'export',
  /* config options here */
  // قم بإزالة هذا السطر: i18n,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;