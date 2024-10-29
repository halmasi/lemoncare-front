import BacktoHomeButton from '@/components/BacktoHomeButton'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col pt-20 h-screen items-center bg-gradient-to-br from-yellow-500 via-gray-400 to-pink-400 text-center text-white">
      <h1 className="text-4xl font-bold  mb-6 drop-shadow-lg">
        صفحه‌ای یافت نشد!
      </h1>
      <p className="mb-4 text-lg max-w-md mx-auto drop-shadow-lg">
        متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد.
      </p>
      <BacktoHomeButton href="/">بازگشت به صفحه اصلی</BacktoHomeButton>
    </div>
  )
}
