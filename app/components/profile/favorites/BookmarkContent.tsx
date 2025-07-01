'use client';

import { PostsProps } from '@/app/utils/schema/blogProps';
import AddToFavorites from '../../AddToFavorites';

export default function BookmarkContent({
  posts,
  onToggleFavorite,
}: {
  posts: PostsProps[];
  onToggleFavorite: (postIdToRemove: string) => void;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Bookmark Content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={post.basicInfo.mainImage.url}
              alt={post.basicInfo.title}
              className="w-32 h-32 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {post.basicInfo.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {post.seo.seoDescription}
              <br />
              {post.documentId}
            </p>
            <AddToFavorites
              post={post}
              onUnfavorite={() => onToggleFavorite(post.documentId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
