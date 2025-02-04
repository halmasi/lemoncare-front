'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useFormState } from 'react-dom';

import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import {
  getFullUserData,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';

import { CartProps, useDataStore } from '@/app/utils/states/useUserdata';

export default function LoginPage() {
  const [formState, formAction] = useFormState(signinAction, {
    success: false,
    user: '',
    jwt: '',
    fieldErrors: {},
  });
  const { setJwt, setUser, setCart, cart } = useDataStore();
  const router = useRouter();

  const errors = formState?.fieldErrors as {
    email?: string[];
    password?: string[];
    server?: string[];
  };

  const handleCart = (fetchedCart: CartProps[]) => {
    if (fetchedCart != cart) {
      const carts = fetchedCart;
      carts.forEach((item) => {
        let dup = 0;
        carts.forEach(async (check) => {
          if (
            item.product.documentId == check.product.documentId &&
            item.variety.id == check.variety.id &&
            item.variety.sub == check.variety.sub
          ) {
            dup++;
            if (dup > 1) {
              carts.splice(carts.indexOf(item), 1);
            }
          }
        });
      });
      setCart(carts);
    }
  };

  const handleLoginSuccess = useCallback(async () => {
    if (!formState.jwt || !formState.user) return;
    await setCookie('jwt', `Bearer ${formState.jwt}`);

    const userData = await getFullUserData(formState.jwt);
    setJwt(formState.jwt);
    setUser(userData.body);
    handleCart(userData.body.cart);
    router.push('/dashboard');
  }, [formState.jwt, formState.user, setJwt, setUser, router]);

  useEffect(() => {
    handleLoginSuccess();
  }, [handleLoginSuccess]);

  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-screen">
      <form
        className="w-full md:w-3/12 flex flex-col gap-2"
        action={formAction}
      >
        <InputBox name="identifier" placeholder="ایمیل" />

        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}
        <InputBox name="password" format="password" placeholder="رمزعبور" />
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors.password[0]}</p>
        )}
        {errors?.server && (
          <p className="text-red-500 text-sm">{errors.server[0]}</p>
        )}

        <SubmitButton>ورود</SubmitButton>
      </form>
    </div>
  );
}
