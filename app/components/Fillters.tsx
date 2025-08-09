'use client';

import { useEffect, useState } from 'react';
import { getCategoryparentHierarchy } from '../utils/data/getProductCategories';
import { ProductProps, ShopCategoryProps } from '../utils/schema/shopProps';
import { useMutation } from '@tanstack/react-query';
import { getProduct } from '../utils/data/getProducts';
import { BrandProps } from '../utils/schema/shopProps/categoryProps';
import { uniqueBrands, uniqueCategories } from '../utils/shopUtils';
import Checkbox from './formElements/Checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import Title from './Title';

export default function Fillters({ products }: { products: ProductProps[] }) {
  const [categories, setCategories] = useState<ShopCategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getDataFn = useMutation({
    mutationFn: async (products: ProductProps[]) => {
      const categoriesList: ShopCategoryProps[] = [];
      let brandsList: BrandProps[] = [];

      await Promise.all(
        products.map(async (productData) => {
          const data = await getProduct({ slug: productData.documentId });
          const product = data.res[0];
          const categoriesData = await getCategoryparentHierarchy(
            product.category
          );

          categoriesList.push(...categoriesData);
          brandsList = [...brandsList, product.brand];
        })
      );

      return { categoriesList, brandsList };
    },
    onSuccess: ({ categoriesList, brandsList }) => {
      setCategories(uniqueCategories(categoriesList));
      setBrands(uniqueBrands(brandsList));
    },
  });
  useEffect(() => {
    if (products) {
      getDataFn.mutate(products);
    }
  }, [products]);

  const toggleFillter = async ({
    slug,
    type,
  }: {
    slug: string;
    type: 'category' | 'brand';
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentFillters = params.getAll(type);

    if (currentFillters.includes(slug)) {
      const updatedFillters = currentFillters.filter((c) => c !== slug);
      params.delete(type);
      updatedFillters.forEach((c) => params.append(type, c));
    } else {
      params.append(type, slug);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex bg-background w-full md:w-4/12  flex-col rounded-lg border p-5 gap-5">
      <div
        className="w-full flex flex-col justify-between gap-2"
        key={'categories' + categories.length}
      >
        {categories && categories.length > 0 && (
          <div>
            <Title>
              <h6 className="text-base">دسته بندی ها</h6>
            </Title>
            <div className="rounded-lg border p-1 h-40 overflow-y-scroll">
              {categories.map((category) => (
                <Checkbox
                  key={category.slug}
                  isChecked={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    const currentFillters = params.getAll('category');
                    return currentFillters.includes(category.slug);
                  }}
                  id={category.slug}
                  onClick={(slug) => {
                    toggleFillter({
                      slug,
                      type: 'category',
                    });
                  }}
                >
                  {category.title}
                </Checkbox>
              ))}
            </div>
          </div>
        )}
      </div>
      <div key={'brands' + brands.length}>
        {brands && brands.length > 0 && (
          <div>
            <Title>
              <h6 className="text-base">برند ها</h6>
            </Title>
            <div className="rounded-lg border p-1 h-40 overflow-y-scroll">
              {brands.map((brand) => (
                <Checkbox
                  key={brand.slug}
                  isChecked={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    const currentFillters = params.getAll('brand');
                    return currentFillters.includes(brand.slug);
                  }}
                  id={brand.slug}
                  onClick={(slug) => {
                    toggleFillter({
                      slug,
                      type: 'brand',
                    });
                  }}
                >
                  {brand.title}
                </Checkbox>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
