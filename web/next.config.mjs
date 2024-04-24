/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
   },
   images: {
      remotePatterns: [
         {
            hostname: 'lh3.googleusercontent.com',
            protocol: `https`,
         },
         {
            hostname: 'randomuser.me',
            protocol: `https`,
         }
      ]
   }
};

export default nextConfig;
