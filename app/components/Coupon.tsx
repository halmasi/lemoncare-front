'use client';

import { useMutation } from '@tanstack/react-query';
import { useCheckoutStore } from '../utils/states/useCheckoutData';
import InputBox from './formElements/InputBox';
import SubmitButton from './formElements/SubmitButton';
import { FormEvent, useRef, useState } from 'react';
import { checkCoupon } from '../utils/data/getCoupons';
import { useCartStore } from '../utils/states/useCartData';
import { toast } from 'react-toastify';

export default function Coupon() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const { cart } = useCartStore();
  const { setCoupon, coupon } = useCheckoutStore();

  const checkCouponFn = useMutation({
    mutationFn: async (coupon: string) => {
      const res = await checkCoupon({ coupon, cart });
      return res.data;
    },
    onSuccess: (data) => {
      if (!data || !data.data || !data.data.length) return;
      setCoupon(data.data[0].couponCode);
      toast.success('کد تخفیف اعمال شد!');
      // console.log(data.data[0].couponCode);
    },
  });

  const submitFn = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      if (
        inputRef.current &&
        inputRef.current.value &&
        inputRef.current.value.trim() != '' &&
        inputRef.current.value.trim().length > 5
      ) {
        const couponCode = inputRef.current.value.trim();
        return couponCode;
      }
    },
    onSuccess: (data) => {
      if (!data) return;
      checkCouponFn.mutate(data);
    },
  });

  return (
    <div className="p-1 rounded-lg border">
      <form onSubmit={submitFn.mutate} className="flex flex-col gap-2 p-5">
        <InputBox
          onChange={(e) => {
            if (
              e.target.value &&
              e.target.value.trim() != '' &&
              e.target.value.trim().length >= 5 &&
              coupon != e.target.value.trim()
            ) {
              setIsValid(true);
            } else {
              setIsValid(false);
            }
          }}
          ref={inputRef}
          flex="col"
          name="coupon"
          ltr
          placeholder="کد تخفیف"
        >
          کد تخفیف
        </InputBox>
        <SubmitButton key={'' + isValid} disabled={!isValid}>
          ثبت کد تخفیف
        </SubmitButton>
      </form>
    </div>
  );
}
