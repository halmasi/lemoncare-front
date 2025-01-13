import { ReactNode } from 'react';

export default function MainSection({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col container max-w-screen-xl py-5 px-10 bg-white border-x-2">
      {children}
    </main>
  );
}
