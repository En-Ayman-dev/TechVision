/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import createWithIntl from 'next-intl/plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  
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
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
        {
        protocol: 'https',
        hostname: 'support.google.com',
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
const withPWAConfig = withPWA(nextConfig);

export default withIntl(withPWAConfig);