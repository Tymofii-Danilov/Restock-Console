import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.dummyjson.com' },
      { protocol: 'https', hostname: 'dummyjson.com' },
    ],
  },
  allowedDevOrigins: ['192.168.0.102'],
};

export default nextConfig;
