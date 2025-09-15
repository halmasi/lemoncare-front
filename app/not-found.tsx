import Image from 'next/image';
import NotFoundImage from '@/public/notfound.svg';
import SubmitButton from './components/formElements/SubmitButton';

export default function NotFound() {
  return (
    <div className="flex bg-gray-50 relative z-10 justify-center">
      <div className="flex min-h-svh w-full justify-center">
        <div className="flex flex-col pt-20 w-full min-h-screen items-center text-center py-10">
          <Image
            className="w-56"
            src={NotFoundImage}
            width={500}
            height={500}
            alt="Not Found"
          />
          <h1>صفحه‌ای یافت نشد!</h1>
          <p>متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد.</p>
          <SubmitButton link="/">بازگشت به صفحه اصلی</SubmitButton>
        </div>
      </div>
    </div>
  );
}
