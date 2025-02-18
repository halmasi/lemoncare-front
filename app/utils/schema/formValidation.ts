import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('لطفا ایمیل را وارد کنید')
    .email('آدرس ایمیل را دوباره بررسی کنید'),
  pass: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      'رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
});

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty('شماره تلفن الزامی است')
    .regex(/^9\d{9}$/, 'شماره تلفن وارد شده معتبر نیست'),

  email: z
    .string()
    .nonempty('ایمیل الزامی است')
    .email('آدرس ایمیل را دوباره بررسی کنید'),

  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
});
