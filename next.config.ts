import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Required for GitHub Pages
  // If your repository is https://github.com/username/miso-gym, 
  // set basePath to "/miso-gym". If it's the root of your domain, remove it.
  basePath: '/miso-gym', 
  assetPrefix: '/miso-gym/',
  trailingSlash: true,
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js image optimization API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
