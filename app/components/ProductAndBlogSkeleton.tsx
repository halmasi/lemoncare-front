export default function ProductAndBlogSkeleton({ count }: { count: number }) {
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <>
      {numbers.map((i) => (
        <div
          key={i}
          className="w-full flex flex-col gap-5 h-96 p-2 bg-gray-400 animate-pulse rounded-lg"
        >
          <div className="w-full h-[70%] bg-gray-500 rounded-lg" />
          <div className="w-[80%] h-[10%] bg-gray-500 rounded-lg" />
          <div className="flex flex-col w-full h-[20%] gap-2">
            <div className="w-[50%] h-[25%] bg-gray-500 rounded-lg" />
            <div className="w-[50%] h-[25%] bg-gray-500 rounded-lg" />
            <div className="w-[50%] h-[25%] bg-gray-500 rounded-lg" />
            <div className="w-[50%] h-[25%] bg-gray-500 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
