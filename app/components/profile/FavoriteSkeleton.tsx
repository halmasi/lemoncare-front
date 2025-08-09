import { BsHeartFill } from 'react-icons/bs';

export default function FavoriteSkeleton() {
  return (
    <div className="flex flex-col gap-2 items-center p-2 w-48 h-fit rounded-lg bg-gray-500 animate-pulse">
      <div className="w-[80%] aspect-square rounded-md bg-gray-300" />
      <div className="w-[80%] h-3 rounded-md bg-gray-300" />
      <div className="w-[80%] flex gap-2">
        <div className="w-[75%] h-3 rounded-md bg-gray-300/60" />
        <BsHeartFill className="text-gray-400" />
      </div>
    </div>
  );
}
