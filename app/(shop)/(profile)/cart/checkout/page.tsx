'use client';

import { useCartStore } from '@/app/utils/states/useCartData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useEffect, useState } from 'react';

export default function page() {
  const { cart, setCart } = useCartStore();
  const { jwt, user, setUser } = useDataStore();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);

  useEffect(() => {
    cart.map((item) => {
      let name = '';
      let color = '';
      let inventory = 0;
      let priceBefore = 0;
      let priceAfter = 0;

      item.product.variety.forEach((varieties) => {
        if (item.variety.id == varieties.uniqueId)
          if (!item.variety.sub) {
            name = varieties.specification;
            color = varieties.color;
            inventory = varieties.inventory;
            priceAfter = varieties.mainPrice;
            priceBefore = varieties.priceBeforeDiscount;
          } else {
            varieties.subVariety.forEach((sub) => {
              if (sub.uniqueId == item.variety.sub) {
                name = varieties.specification + ' | ' + sub.specification;
                color = sub.color != '#000000' ? sub.color : varieties.color;
                inventory = sub.inventory;
                priceAfter = sub.mainPrice;
                priceBefore = sub.priceBefforDiscount;
              }
            });
          }
        color = color == '#000000' ? '' : color;
      });
      setTotalPrice((prev) => prev + priceAfter * item.count);
      setTotalBeforePrice((prev) => prev + priceBefore * item.count);
    });
  }, []);

  return <div>{totalPrice}</div>;
}
