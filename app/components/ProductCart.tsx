import Link from 'next/link';
import Image from 'next/image';
import { ProductProps } from '../utils/schema/shopProps';
import VarietySelector from './VarietySelector';

export default function ProductCart({ product }: { product: ProductProps }) {
  return (
    <div
      key={product.id}
      className="p-2 border rounded-xl transition-shadow hover:shadow-lg"
    >
      <Link
        className="space-y-2"
        href={'/shop/product/' + product.basicInfo.contentCode}
      >
        <div className="flex flex-row justify-end items-end contain-content">
          <Image
            src={product.basicInfo.mainImage.formats.medium.url}
            alt={
              product.basicInfo.mainImage.alternativeText ||
              product.basicInfo.mainImage.formats.medium.name
            }
            width={product.basicInfo.mainImage.formats.medium.width}
            height={product.basicInfo.mainImage.formats.medium.height}
            className="rounded-lg"
          />
          {product.variety.length > 0 && (
            <div className="absolute flex gap-1 px-3 py-1">
              {product.variety.map(
                (variety) =>
                  variety.color && (
                    <div
                      key={variety.id}
                      style={{ background: variety.color }}
                      className="h-3 w-3 rounded-full border-white border-2"
                    />
                  )
              )}
            </div>
          )}
        </div>

        <h6>{product.basicInfo.title}</h6>
      </Link>
      <VarietySelector list product={product} />
    </div>
  );
}
