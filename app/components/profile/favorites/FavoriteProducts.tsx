'use client';

import { ProductProps } from '@/app/utils/schema/shopProps/productProps';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoriteProducts({
  products,
}: {
  products: ProductProps[];
}) {
  console.log('Favorite products Component : ', products);
  return (
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
          {products.map((product, index) => (
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
  );
}
