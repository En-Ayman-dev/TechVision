import createWithIntl from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withIntl = createWithIntl('./src/i18n.ts');

const nextConfig: NextConfig = {
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

export default withIntl(nextConfig);
