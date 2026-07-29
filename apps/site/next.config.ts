import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'cdn.simpleicons.org' }],
  },
};

export default nextConfig;
