/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
   },
   images: {
      remotePatterns: [
         {
            hostname: 'lh3.googleusercontent.com',
            protocol: `https`,
         }
      ]
   }
};

export default nextConfig;
