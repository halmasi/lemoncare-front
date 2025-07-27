/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // This disables the origin check for actions (only for these routes)
      allowFrom: ['https://rt.sizpay.ir'],
    },
  },
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
        hostname: 'rt.sizpay.ir',
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
