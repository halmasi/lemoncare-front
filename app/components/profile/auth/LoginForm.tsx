'use client';

import { useRef, useState } from 'react';
import InputBox from '@/app/components/formElements/InputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useLoginData } from '@/app/utils/states/useLoginData';
import { useMutation } from '@tanstack/react-query';
import {
  checkUserExists,
  updatePostalInformation,
  updateUserInformation,
} from '@/app/utils/data/getUserInfo';
import { cleanPhone, isPhone } from '@/app/utils/miniFunctions';
import {
  getFullUserData,
  setCookie,
  signinAction,
} from '@/app/utils/actions/actionMethods';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { usePathname, useRouter } from 'next/navigation';
import { CartProps } from '@/app/utils/schema/shopProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import {
  getCart,
  updateCartOnLogin,
} from '@/app/utils/actions/cartActionMethods';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';

export default function LoginForm() {
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const path = usePathname();

  const { setStep, setUsername, setErrors, step, username, errors } =
    useLoginData();

  const { setJwt, setUser, jwt, setLoginProcces } = useDataStore();
  const { cart, setCart } = useCartStore();
  const { checkoutAddress } = useCheckoutStore();

  const loginCheckMutation = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const identifier = identifierRef.current?.value || '';
      if (passwordRef.current === null) {
        const result = await checkUserExists(identifier);
        return { userExists: result, identifier, password: '' };
      } else
        return {
          userExists: {
            success: true,
            data: {
              id: 0,
              username: '',
              fullName: '',
            },
          },
          identifier,
          password: passwordRef.current.value,
        };
    },
    onSuccess: ({ userExists, identifier, password }) => {
      if (password == '') {
        if (isPhone(identifier)) setUsername(cleanPhone(identifier));
        if (userExists.success) {
          setUsername(userExists.data.username);
          setStep('login');
        } else setStep('register');
      } else {
        loginMutation.mutateAsync({ password });
      }
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [error.message],
        username: [],
        password: [],
        // email: [],
        server: [],
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ password }: { password?: string }) => {
      const identifier = username;
      if (password) {
        const response = await signinAction(identifier, password);
        if (!response.success) {
          setErrors({
            identifier: [],
            username: [],
            password: ['رمز عبور اشتباه است.'],
            // email: [],
            server: [],
          });
          return;
        }
        setLoading(true);
        const userData = await getFullUserData({
          token: `Bearer ${response.jwt}`,
        });
        if (userData.body.phoneConfirmed) {
          await setCookie('jwt', `Bearer ${response.jwt}`);
          setJwt(response.jwt);
          setUser(userData.body);
          setLoginProcces(true);
          // if (userData.body.shopingCart) {
          //   if (cart.length) {
          //     if (userData.body.shopingCart && userData.body) {
          //       handleCartFn.mutate({
          //         fetchedCart: userData.body.shopingCart.items,
          //         id: userData.body.shopingCart.documentId,
          //       });
          //     }
          //   } else if (userData.body.shopingCart.items.length)
          //     setCart(userData.body.shopingCart.items);
          // }

          if (
            !userData.body.fullName &&
            checkoutAddress &&
            checkoutAddress.firstName &&
            checkoutAddress.lastName
          ) {
            userData.body.fullName =
              checkoutAddress.firstName + ' ' + checkoutAddress.lastName;
            await updateUserInformation(userData.body.id, `Bearer ${jwt}`, {
              fullName: userData.body.fullName,
            });
          }

          if (userData.body.postal_information) {
            if (
              checkoutAddress?.address &&
              !userData.body.postal_information.information.length
            ) {
              await updatePostalInformation(
                [
                  {
                    address: checkoutAddress.address,
                    province: checkoutAddress.province,
                    city: checkoutAddress.city,
                    firstName: checkoutAddress.firstName,
                    lastName: checkoutAddress.lastName,
                    mobileNumber: checkoutAddress.mobileNumber,
                    phoneNumber: checkoutAddress.phoneNumber,
                    postCode: checkoutAddress.postCode,
                    id: 0,
                    isDefault: true,
                  },
                ],
                userData.body.postal_information.documentId
              );
            }
          }
          if (path.startsWith('/login')) router.push('/');
          return;
        }
        //
        setStep('phoneConfirmationLogin');
      }
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error: Error) => {
      setErrors({
        identifier: [],
        username: [],
        password: [error.message],
        // email: [],
        server: [],
      });
    },
  });

  const handleCartFn = useMutation({
    mutationFn: async ({
      fetchedCart,
      id,
    }: {
      fetchedCart: CartProps[];
      id: string;
    }) => {
      if (fetchedCart && cart) {
        const cartMap = new Map<string, CartProps>();
        [...fetchedCart, ...cart].forEach((item) => {
          const key = `${item.product.documentId}-${item.variety.id}-${item.variety.sub}`;
          cartMap.set(key, item);
        });
        const deduplicatedCart = Array.from(cartMap.values());
        updateCartFn.mutate({ newCart: deduplicatedCart, id });
      } else if (fetchedCart && !cart) {
        setCart(fetchedCart);
      } else if (!fetchedCart && cart) {
        updateCartFn.mutate({ newCart: cart, id });
      }
    },
    onSuccess: async () => {},
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  const updateCartFn = useMutation({
    mutationFn: async ({
      newCart,
      id,
    }: {
      newCart: CartProps[];
      id: string;
    }) => {
      const updateCart = newCart.map((item) => {
        return {
          count: item.count,
          product: item.product.documentId,
          variety: item.variety,
        };
      });
      await updateCartOnLogin(updateCart, id);
      const res = await getCart(id);
      return res.data;
    },
    onSuccess: async (data) => {
      if (!data) return;
      setCart(data.items);
    },
    onError: (error: { message: string[] }) => {
      throw new Error('خطا : ' + error.message);
    },
  });

  return (
    <>
      <form
        onSubmit={loginCheckMutation.mutateAsync}
        className="flex flex-col space-y-4"
      >
        <InputBox
          ref={identifierRef}
          name="username"
          placeholder="ایمیل یا شماره تلفن"
          required
          ltr
        />
        {errors.identifier && (
          <p className="text-red-500 text-sm">{errors.identifier.join('\n')}</p>
        )}
        {step == 'login' && (
          <InputBox
            ref={passwordRef}
            name="password"
            type="password"
            placeholder="رمزعبور"
            required
            ltr
          />
        )}
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.join('\n')}</p>
        )}
        <SubmitButton
          isPending={
            loginCheckMutation.isPending || loginMutation.isPending || loading
          }
        >
          {loginCheckMutation.isPending || loginMutation.isPending || loading
            ? step == 'identifier'
              ? 'در حال بررسی...'
              : 'درحال ورود...'
            : step == 'identifier'
              ? 'ادامه'
              : 'ورود'}
        </SubmitButton>
        {step == 'login' && (
          <div className=" flex flex-wrap items-center justify-between">
            <p
              className="cursor-pointer hover:text-accent-pink transition-colors"
              onClick={() => {
                if (username && username != '' && isPhone(username)) {
                  setUsername(cleanPhone(username));
                  if (!isPhone(identifierRef.current?.value || ''))
                    setStep('phoneConfirmationLoginNoPhone');
                  else setStep('phoneConfirmationLogin');
                }
              }}
            >
              ورود با رمز یکبار مصرف
            </p>

            <p
              className="cursor-pointer hover:text-accent-pink transition-colors"
              onClick={() => {
                if (username && username != '' && isPhone(username)) {
                  setUsername(cleanPhone(username));
                  if (!isPhone(identifierRef.current?.value || ''))
                    setStep('phoneConfirmationLoginNoPhone');
                  else setStep('phoneConfirmationLogin');
                }
              }}
            >
              فراموشی رمز عبور
            </p>
          </div>
        )}
      </form>
    </>
  );
}
