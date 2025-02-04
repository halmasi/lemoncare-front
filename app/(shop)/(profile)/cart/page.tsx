'use client';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import Cart from '@/app/components/navbarComponents/Cart';
import { useState } from 'react';

export default function CartPage() {
  const [itemCount, setItemCount] = useState(0);
  return (
    <div className="flex flex-col w-full px-4 pt-2 gap-4 md:max-w-screen-lg">
      <div className="flex gap-1">
        <p className="text-accent-pink">{itemCount}</p>{' '}
        <p> محصول در سبد خرید.</p>
      </div>
      <Cart countFunc={(count: number) => setItemCount(count)} />
      <SubmitButton>تکمیل سفارش</SubmitButton>
    </div>
  );
}
