/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output standalone for Docker
  output: 'standalone',
  
  // Performance optimizations
  compress: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sfb.vn',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Rewrite API requests to backend (optional - for same domain deployment)
  // Uncomment if you want to use Next.js rewrites instead of Nginx
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: process.env.API_SFB_URL 
  //         ? `${process.env.API_SFB_URL}/api/:path*`
  //         : 'http://localhost:4000/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;


