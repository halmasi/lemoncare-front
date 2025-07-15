import { ReactNode } from 'react';

export default function Title({
  children,
  className = '',
  bgColor = 'bg-accent-green',
}: {
  children: ReactNode;
  className?: string;
  bgColor?: string;
}) {
  return (
    <div className={`w-fit ${className}`}>
      {children}
      <div className={`w-[75%] h-1 ${bgColor}`} />
    </div>
  );
}
