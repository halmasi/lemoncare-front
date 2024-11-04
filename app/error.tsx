'use client';

import ColoredButton from '@/components/ColoredButton';
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
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-yellow-500 via-gray-400 to-pink-400 text-center text-white">
      <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
        خطایی رخ داده است!
      </h2>
      <p className="mb-4 text-lg max-w-md mx-auto drop-shadow-lg">
        {error.message && 'مشکلی پیش آمده است, لطفاً دوباره تلاش کنید.'}
        <br />
        {error.message}
      </p>
      <ColoredButton onClick={reset} href={''}>
        تلاش دوباره
      </ColoredButton>
    </div>
  );
}
