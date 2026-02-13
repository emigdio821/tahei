import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typedRoutes: true,
  serverExternalPackages: ['re2'],
}

export default nextConfig
