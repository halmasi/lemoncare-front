/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lemoncare.storage.c2.liara.space',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '0.gravatar.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
