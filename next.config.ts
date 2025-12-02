import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
      // If you need pixelvision.studio domain as well
      {
        protocol: 'https',
        hostname: 'pixelvision.studio',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
