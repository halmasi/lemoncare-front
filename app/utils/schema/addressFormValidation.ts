import { z } from 'zod';
import states from '@/public/cities.json';

// Helper function to check if a province exists
const isValidProvince = (province: string) => {
  return states.some((state) => state.name === province);
};

// Helper function to check if a city exists within a given province
const isValidCityInProvince = (city: string, province: string) => {
  const provinceData = states.find((state) => state.name === province);
  return provinceData
    ? provinceData.cities.some((c) => c.name === city)
    : false;
};

// Zod schema for address validation
export const addressSchema = z
  .object({
    address: z.string().nonempty('آدرس باید پر شود'),
    postCode: z
      .number({ message: 'کد پستی باید 10 رقم باشد' })
      .min(1000000000, 'کد پستی باید 10 رقم باشد')
      .max(9999999999, 'کد پستی باید 10 رقم باشد'),
    firstName: z
      .string({ message: 'نام باید پر شود' })
      .nonempty({ message: 'نام باید پر شود' }),
    lastName: z
      .string({ message: 'نام خانوادگی باید پر شود' })
      .nonempty('نام خانوادگی باید پر شود'),
    province: z
      .string({ message: 'استان باید انتخاب شود' })
      .nonempty('استان باید انتخاب شود')
      .refine(isValidProvince, { message: 'استان وارد شده معتبر نیست' }),
    city: z
      .string({ message: 'شهر باید وارد شود' })
      .nonempty('شهر باید وارد شود'),
    phoneNumber: z
      .number({ message: 'شماره تلفن وارد شده معتبر نیست' })
      .max(9999999999, 'شماره تلفن وارد شده معتبر نیست'),
    mobileNumber: z
      .string({ message: 'شماره تلفن همراه وارد شده معتبر نیست' })
      .nonempty('شماره تلفن همراه الزامی است')
      .regex(/^9\d{9}$/, 'شماره تلفن همراه وارد شده معتبر نیست'),
  })
  .superRefine((data, ctx) => {
    if (!isValidCityInProvince(data.city, data.province)) {
      ctx.addIssue({
        path: ['city'],
        message: 'شهر وارد شده معتبر نیست برای این استان',
        code: 'custom',
      });
    }
  });
