// 'use server';
// import { loginSchema } from '@/app/utils/schema/formValidation';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// export async function signinAction(prevState: any, formData: FormData) {
//   const result = loginSchema.safeParse({
//     email: formData.get('email'),
//     pass: formData.get('pass'),
//   });
//   const data = result.success
//     ? { success: true, data: result.data }
//     : { success: false, data: result.error.flatten() };
//   const response = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       identifier: result.data.email,
//       password: result.data.pass,
//     }),
//   });
//   const { jwt, user } = await response.json();

//   // Store JWT in localStorage or a secure cookie (example here uses localStorage)
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('jwt', jwt);
//   }

//   console.log({
//     ...prevState,
//     data: { success: true, user },
//   });
//   return {
//     ...prevState,
//     data,
//   };
// }
// export async function signinAction(prevState: any, formData: FormData) {
//   console.log('formData:', Array.from(formData.entries())); // Debug the input

//   const result = loginSchema.safeParse({
//     email: formData.get('email'),
//     pass: formData.get('pass'),
//   });

//   if (!result.success) {
//     console.error('Validation errors:', result.error.flatten());
//     return {
//       ...prevState,
//       data: { success: false, data: result.error.flatten() },
//     };
//   }

//   try {
//     const response = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         identifier: result.data.email,
//         password: result.data.pass,
//       }),
//     });
//     console.log(
//       'this is response #######################################3\n',
//       response
//     );
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Authentication failed');
//     }

//     const { jwt, user } = await response.json();

//     if (typeof window !== 'undefined') {
//       localStorage.setItem('jwt', jwt);
//     }
//     console.log({
//       ...prevState,
//       data: { success: true, user },
//     });
//     return {
//       ...prevState,
//       data: { success: true, user },
//     };
//   } catch (error: any) {
//     console.error('Login error:', error.message);
//     return {
//       ...prevState,
//       data: { success: false, data: { general: error.message } },
//     };
//   }
// }
'use server';

import { loginSchema } from '@/app/utils/schema/formValidation';
import { cookies } from 'next/headers';

export const signinAction = async (_prevState: any, formData: FormData) => {
  const email = formData.get('identifier')?.toString() || null;
  const password = formData.get('password')?.toString() || null;

  // Check for missing fields
  if (!email || !password) {
    return {
      success: false,
      fieldErrors: {
        email: !email ? ['ایمیل الزامی است'] : undefined,
        password: !password ? ['رمز عبور الزامی است'] : undefined,
      },
    };
  }

  // Validate with Zod schema
  const result = loginSchema.safeParse({
    email,
    pass: password,
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: result.data.email,
        password: result.data.pass,
      }),
    });

    // if (!res.ok) {
    //   const errorData = await res.json();
    //   return {
    //     success: false,
    //     fieldErrors: {
    //       server: [errorData.message || 'ورود ناموفق بود'],
    //     },
    //   };
    // }

    const reqResualt = await res.json();
    const { jwt, user } = reqResualt;

    return {
      success: true,
      userdata: user,
      token: jwt,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      fieldErrors: {
        server: ['خطایی رخ داد، لطفا دوباره تلاش کنید'],
      },
    };
  }
};

export const setCookie = async (name: string, cookie: string) => {
  const cookieStore = cookies();
  cookieStore.set(name, cookie);
};

export const logoutAction = async () => {
  // Remove token from cookies
  // const cookieStore = cookies();
  //cookieStore.delete('token', { path: '/' });

  // Redirect to login page after logout
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
