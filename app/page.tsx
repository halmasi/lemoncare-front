import PostsSkeleton from '@/components/Skeleton';

export default function Home() {
  return (
    <main className="container max-w-screen-xl py-5 px-10">
      <h1>متن هدر ۱</h1>
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-3">
        <PostsSkeleton />
        <PostsSkeleton />
        <PostsSkeleton />
      </div>
    </main>
  );
}
