'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { getFavorites } from '@/app/utils/data/getUserInfo';
import { FavoriteListProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function Favorites() {
  const { user } = useDataStore();
  const [favoritesData, setFavoritesData] = useState<FavoriteListProps>();

  const getFavoritesFn = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await getFavorites(documentId);
      return res.data || [];
    },
    onSuccess: (data) => {
      setFavoritesData(data);
    },
    onError: (error: { message: string[] }) => {
      console.error('Error fetching favorites:', error.message);
    },
  });

  useEffect(() => {
    if (user?.favorites) {
      Promise.all(
        user.favorites.map((favorite) =>
          favorite.documentId
            ? getFavoritesFn.mutateAsync(favorite.documentId)
            : Promise.resolve()
        )
      );
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Favorite Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favoritesData?.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
              >
                <img
                  src={product.basicInfo.mainImage.url}
                  alt={product.basicInfo.title}
                  className="w-32 h-32 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.basicInfo.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {product.seo.seoDescription}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Bookmark Content
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {favoritesData?.posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
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
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  );
}
