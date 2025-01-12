import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('آدرس ایمیل را دوباره بررسی کنید')
    .nonempty('لطفا ایمیل را وارد کنید'),
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
    .nonempty('نام کاربری الزامی است')
    .regex(/^9\d{9}$/, '123 شماره تلفن وارد شده معتبر نیست'),

  email: z
    .string()
    .email('آدرس ایمیل را دوباره بررسی کنید')
    .nonempty('ایمیل الزامی است'),
  phoneNumber: z
    .string()
    //.regex(/^\d+$/, 'شماره تلفن باید فقط شامل اعداد باشد'),

    .regex(/^9\d{9}$/, 'شماره تلفن وارد شده معتبر نیست'),
  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
});
