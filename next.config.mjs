/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lemoncare.storage.c2.liara.space',
        port: '',
      },
    ],
  },
};

export default nextConfig;
