/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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


