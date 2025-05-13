import LoadingAnimation from '@/app/components/LoadingAnimation';

export default function page() {
  return (
    <div className="flex flex-col items-center justify-start w-full">
      <LoadingAnimation />
      <p>در حال انتقال به درگاه پرداخت</p>
      <p>لطفا منتظر بمانید</p>
    </div>
  );
}
