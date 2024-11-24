import ColoredButton from '@/components/ColoredButton';
import NotFoundImage from '/public/notfound.svg';
import Image from 'next/image';
export default function NotFound() {
  return (
    <div className="flex flex-col pt-20 w-full min-h-screen items-center bg-gradient-to-br from-yellow-500 via-gray-400 to-pink-400 text-center text-white py-10">
      <Image
        className="w-56"
        src={NotFoundImage.src}
        width={NotFoundImage.width}
        height={NotFoundImage.height}
        alt="Not Found"
      />
      <h1>صفحه‌ای یافت نشد!</h1>
      <p>متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد.</p>
      <ColoredButton href="/">بازگشت به صفحه اصلی</ColoredButton>
    </div>
  );
}