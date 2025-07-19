import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty('شماره تلفن الزامی است')
    .refine(
      (val) =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) || /^9\d{9}$/.test(val),
      'شماره تلفن وارد شده معتبر نیست'
    ),
  pass: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/,
      'رمز عبور باید شامل حروف و اعداد باشد'
    ),
});

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty('شماره تلفن الزامی است')
    .regex(/^98\d{10}$/, 'شماره تلفن وارد شده معتبر نیست'),

  // email: z
  //   .string()
  //   .nonempty('ایمیل الزامی است')
  //   .email('آدرس ایمیل را دوباره بررسی کنید'),

  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/,
      'رمز عبور باید شامل حروف و اعداد باشد'
    ),
});
export const updateUserInformationSchema = z.object({
  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .max(32, 'رمز عبور حداکثر ۳۲ کاراکتر میباشد')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/,
      'رمز عبور باید شامل حروف و اعداد باشد'
    )
    .optional(),
  fullName: z
    .string()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد')
    .max(50, 'نام و نام خانوادگی نباید بیشتر از ۵۰ کاراکتر باشد')
    .optional(),

  email: z.string().email('آدرس ایمیل معتبر نیست').optional(),

  username: z
    .string()
    .regex(/^98\d{10}$/, 'شماره تلفن معتبر نیست')
    .optional(),
});
