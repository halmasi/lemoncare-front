import LoadingAnimation from '@/components/LoadingAnimation';

export default function loading() {
  return (
    <div>
      <h2 className="pt-10">در حال بارگذاری ...</h2>
      <LoadingAnimation />
    </div>
  );
}
