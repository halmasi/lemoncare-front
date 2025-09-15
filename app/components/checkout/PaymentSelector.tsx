'use client';
import { useEffect, useState } from 'react';
import RadioButton from '../formElements/RadioButton';

export default function PaymentSelector({
  onPaymentMethodChange,
}: {
  onPaymentMethodChange: (method: string) => void;
}) {
  const [selectedmethod, setSelectedmethod] = useState<string>('online');

  useEffect(() => {
    onPaymentMethodChange(selectedmethod);
  }, [selectedmethod]);

  return (
    <div className="flex flex-col w-full p-2 gap-2">
      <RadioButton
        id="online"
        isSelected={selectedmethod == 'online'}
        onClick={(id: string) => {
          setSelectedmethod(id);
          onPaymentMethodChange(id);
        }}
      >
        <p>پرداخت آنلاین توسط کارت های عضو شتاب</p>
      </RadioButton>
      <RadioButton
        id="offline"
        isSelected={selectedmethod == 'offline'}
        onClick={(id: string) => {
          setSelectedmethod(id);
          onPaymentMethodChange(id);
        }}
      >
        <p>پرداخت به صورت کارت به کارت</p>
      </RadioButton>
      {/* <RadioButton
        id="snapp"
        isSelected={selectedmethod == 'snapp'}
        onClick={(id: string) => {
          setSelectedmethod(id);
        }}
      >
        <p>پرداخت توسط اسنپ پی</p>
      </RadioButton> */}
    </div>
  );
}
