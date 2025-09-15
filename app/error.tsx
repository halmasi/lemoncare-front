'use client';

// import { useEffect } from 'react';
import SubmitButton from './components/formElements/SubmitButton';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  // export default function Error({ error, reset }: ErrorProps) {
  //   useEffect(() => {
  //     // Log the error to an error reporting service
  //     console.error(error);
  //   }, [error]);

  return (
    <div className="flex flex-col pt-20 w-full h-screen items-center text-center">
      <h1>خطایی رخ داده است!</h1>
      <p>
        مشکلی پیش آمده است, لطفاً دوباره تلاش کنید.
        <br />
        {/* {error.message} */}
      </p>
      <SubmitButton onClick={reset} link={'#'}>
        تلاش دوباره
      </SubmitButton>
    </div>
  );
}
