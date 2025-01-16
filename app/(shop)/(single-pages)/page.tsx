import Suggestions from '@/app/components/Suggestions';
import { getArticleSuggestions } from '@/app/utils/data/getSuggestions';

export default async function page() {
  const suggestedArticles = await getArticleSuggestions('homepage-slide');
  return (
    <>
      <Suggestions posts={suggestedArticles.posts} />
      <div>
        {/* <div className="flex flex-row flex-wrap pt-5 justify-center w-fit gap-2">
        <div className="bg-gray-500 w-60 h-60 rounded-full" />
        <div className="bg-gray-500 w-60 h-60 rounded-full" />
        <div className="bg-gray-500 w-60 h-60 rounded-full" />
        <div className="bg-gray-500 w-60 h-60 rounded-full" />
        <div className="bg-gray-500 w-60 h-60 rounded-full" />
      </div> */}
      </div>
    </>
  );
}
