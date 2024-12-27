import Image from 'next/image';
import { getProducts } from '../utils/data/getProducts';
import VarietySelector from '../components/VarietySelector';
import Link from 'next/link';

export default async function shopPage() {
  const products = await getProducts(3);
  return (
    <div className="flex flex-col container py-5 px-10">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-4 gap-3">
        {products.map((item) => {
          return (
            <div
              key={item.id}
              className="p-2 border rounded-xl transition-shadow hover:shadow-lg"
            >
              <Link
                className="space-y-2"
                href={'/shop/product/' + item.basicInfo.contentCode}
              >
                <div className="flex flex-row justify-end items-end contain-content">
                  <Image
                    src={item.basicInfo.mainImage.formats.medium.url}
                    alt={
                      item.basicInfo.mainImage.alternativeText ||
                      item.basicInfo.mainImage.formats.medium.name
                    }
                    width={item.basicInfo.mainImage.formats.medium.width}
                    height={item.basicInfo.mainImage.formats.medium.height}
                    className="rounded-lg"
                  />
                  {item.variety.length > 0 && (
                    <div className="absolute flex gap-1 px-3 py-1">
                      {item.variety.map(
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

                <h6>{item.basicInfo.title}</h6>
              </Link>
              <VarietySelector product={item} />
              {item.variety.length > 0 && (
                <strong>{item.variety[0].subVariety[0].mainPrice}</strong>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
