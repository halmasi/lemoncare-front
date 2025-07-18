import { ReactNode } from 'react';

export default function Title({
  children,
  className = '',
  underLineClass = 'bg-accent-green',
}: {
  children: ReactNode;
  className?: string;
  underLineClass?: string;
}) {
  return (
    <div className={`w-fit ${className}`}>
      {children}
      <div className={`w-[75%] h-1 ${underLineClass}`} />
    </div>
  );
}
