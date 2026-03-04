import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  cacheComponents: true,
  cacheLife: {
    page: {
      stale: 3600, // 1 hour
      revalidate: 900, // 15 minutes
      expire: 86400, // 1 day
    },
  }
};

export default nextConfig;
