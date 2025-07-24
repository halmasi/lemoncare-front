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
      {
        protocol: 'https',
        hostname: 'me.sizpay.ir',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'trustseal.enamad.ir',
        port: '',
      },
    ],
  },
};

export default nextConfig;
