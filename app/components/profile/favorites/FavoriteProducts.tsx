import { ProductProps } from '@/app/utils/schema/shopProps/productProps';
import { lowestPrice } from '@/app/utils/shopUtils';
import Toman from '@/app/components/Toman';
import AddToFavorites from '../../AddToFavorites';

export default function FavoriteProducts({
  products,
}: {
  products: ProductProps[];
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Favorite Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
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
            <Toman>
              {(lowestPrice(product).price / 10).toLocaleString('fa-IR')}
            </Toman>
            <AddToFavorites product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
