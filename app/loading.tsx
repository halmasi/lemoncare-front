import LoadingAnimation from '@/components/LoadingAnimation';

export default function loading() {
  return (
    <div className="flex flex-col w-full min-h-[80svh] justify-center items-center">
      <h2 className="pt-10">در حال بارگذاری ...</h2>
      <LoadingAnimation />
    </div>
  );
}
