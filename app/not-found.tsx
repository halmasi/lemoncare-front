import ColoredButton from '@/components/ColoredButton';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col pt-20 w-full h-screen items-center bg-gradient-to-br from-yellow-500 via-gray-400 to-pink-400 text-center text-white">
      <h1>صفحه‌ای یافت نشد!</h1>
      <p>متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد.</p>
      <ColoredButton href="/">بازگشت به صفحه اصلی</ColoredButton>
    </div>
  );
}
