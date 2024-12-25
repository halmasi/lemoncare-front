'use server';
import { loginSchema } from '@/utils/schema/formValidation';
export async function signinAction(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    pass: formData.get('pass'),
  });
  const data = result.success
    ? { success: true, data: result.data }
    : { success: false, data: result.error.flatten() };
  return {
    ...prevState,
    data,
  };
}
