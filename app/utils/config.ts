export const dynamic = 'force-dynamic';

export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  strapiToken: process.env.NEXT_PUBLIC_STRAPI_TOKEN,
  backendPath: process.env.NEXT_PUBLIC_BACKEND_PATH,
  gravatarUrl: process.env.NEXT_PUBLIC_GRAVATAR_URI,
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
  postexToken: process.env.NEXT_PUBLIC_POSTEX_API_TOKEN,
  sizpayUsername: process.env.NEXT_PUBLIC_SIZPAY_USERNAME,
  sizpayPassword: process.env.NEXT_PUBLIC_SIZPAY_PASSWORD,
  sizpaySign: process.env.NEXT_PUBLIC_SIZPAY_SIGN,
  sizpayTerminalId: process.env.NEXT_PUBLIC_SIZPAY_TERMINAL_ID,
  sizpayMerchantId: process.env.NEXT_PUBLIC_SIZPAY_MERCHANT_ID,
  sizpayToken: process.env.NEXT_PUBLIC_SIZPAY_TOKEN,
};
