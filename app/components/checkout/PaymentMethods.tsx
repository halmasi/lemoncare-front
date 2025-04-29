import { ReactNode } from 'react';

interface PaymentMethodsProps {
  children: ReactNode;
}

export default function PaymentMethods({ children }: PaymentMethodsProps) {
  return <div className="w-full rounded-lg p-2 border">{children}</div>;
}
