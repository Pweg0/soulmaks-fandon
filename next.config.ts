import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        pathname: '/masked-gaming/**',
      },
    ],
  },
}

const withMDX = createMDX({})
export default withMDX(nextConfig)
