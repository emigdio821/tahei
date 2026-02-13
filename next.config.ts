import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typedRoutes: true,
  serverExternalPackages: ['re2'],
}

export default nextConfig
