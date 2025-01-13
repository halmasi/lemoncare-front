'use client';

import ColoredButton from '@/app/components/ColoredButton';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col pt-20 w-full h-screen items-center bg-gradient-to-br from-yellow-500 via-gray-400 to-pink-400 text-center text-white">
      <h1>خطایی رخ داده است!</h1>
      <p>
        مشکلی پیش آمده است, لطفاً دوباره تلاش کنید.
        <br />
        {error.message}
      </p>
      <ColoredButton onClick={reset} href={'#'}>
        تلاش دوباره
      </ColoredButton>
    </div>
  );
}
