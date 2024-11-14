export default function PostsSkeleton() {
  return (
    <div>
      <div className="w-[50%] bg-gray-400/50 h-3 mb-1" />
      <div className="flex flex-col bg-gray-200 p-2 rounded-lg animate-pulse duration-50 space-y-2">
        <div className="w-full flex flex-col justify-end space-y-2 p-3 bg-gray-500 rounded-lg h-[200px]">
          <div className="w-[50%] bg-gray-400/50 h-3" />
          <div className="w-[80%] bg-gray-400/50 h-3" />
        </div>
        <div className="w-[95%] bg-gray-500 h-3" />
        <div className="w-[95%] bg-gray-500 h-3" />
        <div className="w-[50%] bg-gray-500 h-3" />
        <div className="flex items-center">
          <div className="w-8 rounded-full bg-gray-500 aspect-square" />
          <div className="w-[30%] bg-gray-500 h-4 mx-2" />
        </div>
      </div>
    </div>
  );
}
