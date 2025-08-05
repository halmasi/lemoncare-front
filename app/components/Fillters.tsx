'use client';

import { useEffect, useState } from 'react';
import { getCategoryparentHierarchy } from '../utils/data/getProductCategories';
import { ProductProps, ShopCategoryProps } from '../utils/schema/shopProps';
import { useMutation } from '@tanstack/react-query';
import { getProduct } from '../utils/data/getProducts';
import SubmitButton from './formElements/SubmitButton';
import { BrandProps } from '../utils/schema/shopProps/categoryProps';
import { uniqueBrands, uniqueCategories } from '../utils/shopUtils';

export default function Fillters({ products }: { products: ProductProps[] }) {
  const [categories, setCategories] = useState<ShopCategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);

  const getDataFn = useMutation({
    mutationFn: async (products: ProductProps[]) => {
      products.map(async (productData) => {
        const data = await getProduct({ slug: productData.documentId });
        const product = data.res[0];
        const categoriesData = await getCategoryparentHierarchy(
          product.category
        );
        setCategories(() => {
          return uniqueCategories([...categories, ...categoriesData]);
        });

        setBrands(() => {
          return uniqueBrands([...brands, product.brand]);
        });
      });
    },
  });
  useEffect(() => {
    if (products) {
      getDataFn.mutate(products);
    }
  }, [products]);

  return (
    <div className="hidden md:flex flex-col w-4/12 rounded-lg border">
      <SubmitButton onClick={() => getDataFn.mutate(products)}>
        click
      </SubmitButton>
      {/* {products.map((product) => (
        <p key={product.documentId}>{product.category.title}</p>
      ))} */}
      <div key={'categories' + categories.length}>
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <p key={'category' + index}>{category.title}</p>
          ))}
      </div>
      <div key={'brands' + brands.length}>
        {brands && brands.length > 0 && (
          <div className="py-12">
            {brands.map((brand, index) => (
              <p key={'brand' + index}>{brand.title}</p>
            ))}
          </div>
        )}
      </div>

      <div></div>
    </div>
  );
}
