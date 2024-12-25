import { z } from 'zod';
export const loginSchema = z.object({
  email: z
    .string()
    .email('آدرس ایمیل را دوباره یررسی کنید')
    .nonempty('لطفا ایمیل را وارد کنید'),
  pass: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'رمز عبور باید حاوی کاراکتر بزرگ کوچک و عدد باشد'
    ),
});
