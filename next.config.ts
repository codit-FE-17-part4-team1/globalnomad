import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://sp-globalnomad-api.vercel.app/17-1/:path*',
      },
    ];
  },
};

export default nextConfig;
