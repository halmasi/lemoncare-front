'use client';
import { BiShoppingBag } from 'react-icons/bi';
import RadioButton from './formElements/RadioButton';
import { useEffect, useState } from 'react';
import DiscountTimer from './DiscountTimer';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../utils/states/useCartData';
import { useDataStore } from '../utils/states/useUserdata';
import { addToCart, getCart } from '@/app/utils/actions/cartActionMethods';
import SubmitButton from './formElements/SubmitButton';
import log from '@/app/utils/logs';
import Count from './navbarComponents/Count';
// import { useRouter } from 'next/navigation';
import Toman from './Toman';
import { ProductProps } from '../utils/schema/shopProps/productProps';

interface NewItemProps {
  count: number;
  id: string;
  variety: { id: number; sub: number | null };
}

function AddButton({
  product,
  selected,
  price,
  isPending,
  handleAddToCart,
}: {
  product: ProductProps;
  selected: {
    id: number;
    sub: number | null;
    uniqueId: number;
    uniqueSub: number | null;
  };
  price: { price: number | null };
  isPending: boolean;
  handleAddToCart: (object: NewItemProps) => void;
}) {
  const { cart } = useCartStore();

  if (cart) {
    let findCart = cart.find(
      (item) =>
        item.product.documentId == product.documentId &&
        item.variety.id == selected.uniqueId &&
        item.variety.sub == selected.uniqueSub
    );
    if (!findCart || findCart.count < 1 || isPending) {
      return (
        <SubmitButton
          onClick={() => {
            handleAddToCart({
              count: 1,
              id: product.documentId,
              variety: { id: selected.uniqueId, sub: selected.uniqueSub },
            });
          }}
          disabled={!price.price || isPending}
        >
          <span>افزودن به سبد خرید</span> <BiShoppingBag />
        </SubmitButton>
      );
    } else {
      const id = product.variety.find(
        (item) => item.uniqueId == selected.uniqueId
      );
      const sub = id?.subVariety.find(
        (item) => item.uniqueId == selected.uniqueSub
      );
      let inventory = 0;
      if (id && sub) {
        inventory = sub.inventory;
      } else if (!sub && id) {
        inventory = id.inventory;
      }
      return (
        <Count
          key={selected.sub || selected.id}
          cartItem={findCart}
          inventory={inventory}
          isProductPage
        />
      );
    }
  } else {
    return (
      <SubmitButton
        onClick={() => {
          handleAddToCart({
            count: 1,
            id: product.documentId,
            variety: {
              id: selected.uniqueId,
              sub: selected.uniqueSub,
            },
          });
        }}
        disabled={!price.price || isPending}
      >
        <span>افزودن به سبد خرید</span> <BiShoppingBag />
      </SubmitButton>
    );
  }
}

export default function VarietySelector({
  product,
  list,
}: {
  product: ProductProps;
  list?: boolean;
}) {
  const { user, jwt } = useDataStore();
  const { cart, cartProducts, setCartProducts, setCart } = useCartStore();

  // const router = useRouter();

  const addToCartFn = useMutation({
    mutationFn: async (newItem: NewItemProps) => {
      if (user && user.id && cart) {
        const res = await addToCart(cart, newItem, user.shopingCart.documentId);
        return res;
      }
    },
    onSuccess: async (data) => {
      if (!data || !user) return;
      const getCartData = await getCart(user.shopingCart.documentId);
      setCart(getCartData.data.items);
      const id = product.variety.find(
        (item) => item.uniqueId == selected.uniqueId
      );
      const sub = id?.subVariety.find(
        (item) => item.uniqueId == selected.uniqueSub
      );
      log(
        `user ${user.fullName} with the id ${user.id} added new item to cart\nproduct info:\nproduct name: ${product.basicInfo.title}, link: /shop/product/${product.basicInfo.contentCode},\nproduct detail: ${id && id.specification}, ${sub && sub.specification}`
      );
    },
    onError: async (error) => {
      log(error.message + ' ' + error.cause, 'error');
    },
  });

  const [selected, setSelected] = useState<{
    id: number;
    sub: number | null;
    uniqueId: number;
    uniqueSub: number | null;
  }>({
    id: 0,
    sub: null,
    uniqueId: 0,
    uniqueSub: null,
  });
  const [available, setAvailable] = useState<boolean>(true);
  const [price, setPrice] = useState<{
    id: number;
    sub: number | null;
    before?: number | null;
    end?: number | null;
    price: number | null;
  }>({
    id: selected.id,
    sub: selected.sub,
    price: null,
  });
  const itemSelectFunc = ({
    id,
    sub,
    uid,
    usub,
  }: {
    id: number;
    sub: number | null;
    uid: number;
    usub: number | null;
  }) => {
    setSelected({ id, sub, uniqueId: uid, uniqueSub: usub });
  };

  useEffect(() => {
    const lessPrice: {
      id: number | null;
      sub: number | null;
      uid: number;
      usub: number | null;
      price: number;
    } = { id: null, sub: null, uid: 0, usub: null, price: 0 };
    product.variety.map((item) => {
      if (item.subVariety.length) {
        item.subVariety.map((sub) => {
          if (sub.mainPrice < lessPrice.price || !lessPrice.price) {
            lessPrice.id = item.id;
            lessPrice.sub = sub.id;
            lessPrice.uid = item.uniqueId;
            lessPrice.usub = sub.uniqueId;
            lessPrice.price = sub.mainPrice;
          }
        });
        if (
          (item.mainPrice && item.mainPrice < lessPrice.price) ||
          !lessPrice.price
        ) {
          lessPrice.id = item.id;
          lessPrice.sub = null;
          lessPrice.uid = item.uniqueId;
          lessPrice.usub = null;
          lessPrice.price = item.mainPrice;
        }
      }
    });
    if (lessPrice.price && lessPrice.id) {
      setSelected({
        id: lessPrice.id,
        sub: lessPrice.sub,
        uniqueId: lessPrice.uid,
        uniqueSub: lessPrice.usub,
      });
    } else setAvailable(true);
  }, []);

  useEffect(() => {
    const mainIdPrice = product.variety.find(
      (e) => e.id == selected.id
    )?.mainPrice;
    const subIdPrice = product.variety
      .find((e) => e.id == selected.id)
      ?.subVariety.find((s) => s.id == selected.sub)?.mainPrice;
    if (mainIdPrice && selected.sub == null) {
      const endDate =
        new Date(
          product.variety.find((e) => e.id == selected.id)!.endOfDiscount!
        ).getTime() || null;

      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety.find((e) => e.id == selected.id)
            ?.priceBeforeDiscount || null,
        end: endDate || null,
        price: mainIdPrice,
      });
    } else if (selected.sub != null && subIdPrice) {
      const endDate =
        new Date(
          product.variety
            .find((e) => e.id == selected.id)!
            .subVariety.find((s) => s.id == selected.sub)!.endOfDiscount!
        ).getTime() || null;
      setPrice({
        id: selected.id,
        sub: selected.sub,
        before:
          product.variety
            .find((e) => e.id == selected.id)
            ?.subVariety.find((s) => s.id == selected.sub)
            ?.priceBefforDiscount || null,
        end: endDate || null,
        price: subIdPrice,
      });
    } else {
      setPrice({
        id: selected.id,
        sub: null,
        before: null,
        end: null,
        price: null,
      });
    }
  }, [selected]);

  const handleAddToCart = (newItem: NewItemProps) => {
    const findProduct = cartProducts.find(
      (item) => item.documentId == newItem.id
    );
    if (!findProduct) {
      const newArray = cartProducts;
      newArray.push({
        basicInfo: product.basicInfo,
        documentId: product.documentId,
        variety: product.variety,
      });
      setCartProducts(newArray);
    }
    const id = cart && cart.length ? cart[cart.length - 1].id + 1 : 1;

    if (jwt && user && cart) {
      const newCart = cart;
      newCart.push({ ...newItem, product, id });
      setCart(newCart);
      addToCartFn.mutate(newItem);
    } else if (cart) {
      const found = cart.find((item) => {
        item.product.documentId == newItem.id &&
          item.variety == newItem.variety;
      });
      if (found) return;
      const newCart = cart;
      newCart.push({ ...newItem, product, id });
      setCart(newCart);
    } else {
      setCart([{ ...newItem, product, id }]);
    }
  };

  return list ? (
    <>
      {price.price ? (
        <div>
          {price.before && (
            <div className="flex flex-col gap-3 pb-2">
              <div className="flex gap-3">
                <p className="flex gap-2 items-center">
                  <span className="text-sm  text-gray-500 line-through">
                    {parseInt(price.before / 10 + '').toLocaleString('fa-IR')}
                  </span>
                </p>
                <Toman className="text-accent-green fill-accent-green">
                  <h6>
                    {parseInt(price.price / 10 + '').toLocaleString('fa-IR')}{' '}
                  </h6>
                </Toman>
              </div>
              <p>
                <strong className="p-1 bg-accent-pink rounded-xl text-background">
                  تخفیف{' '}
                  {((1 - price.price / price.before) * 100).toLocaleString(
                    'fa-IR',
                    { style: 'decimal', maximumFractionDigits: 0 }
                  )}{' '}
                  %
                </strong>
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <AddButton
              key={selected.uniqueSub || selected.uniqueId}
              handleAddToCart={handleAddToCart}
              isPending={addToCartFn.isPending}
              price={price}
              product={product}
              selected={selected}
            />
          </div>
          {price.end && <DiscountTimer end={price.end} />}
        </div>
      ) : (
        <div>{!available && <h5 className="text-red-500">ناموجود</h5>}</div>
      )}
    </>
  ) : (
    <>
      <div className="flex flex-col w-full md:w-[80%] min-h-[30svh] m-10 mt-0 p-5 border bg-gray-100 rounded-xl justify-center items-center">
        {price.price ? (
          <>
            <h5>{product.off}</h5>
            <strong>قیمت</strong>
            <div className="flex flex-col items-center gap-1">
              {price.before && (
                <>
                  <p className="flex gap-2 items-center">
                    <span className="text-sm  text-gray-500 line-through">
                      {parseInt(price.before / 10 + '').toLocaleString('fa-IR')}
                    </span>
                    <strong className="p-1 bg-accent-pink rounded-xl text-background">
                      تخفیف{' '}
                      {((1 - price.price / price.before) * 100).toLocaleString(
                        'fa-IR',
                        { style: 'decimal', maximumFractionDigits: 0 }
                      )}{' '}
                      %
                    </strong>
                  </p>
                </>
              )}
            </div>
            <Toman className="text-accent-green fill-accent-green">
              <h6>
                {parseInt(price.price / 10 + '').toLocaleString('fa-IR')}{' '}
              </h6>
            </Toman>
            {price.end && <DiscountTimer end={price.end} />}
          </>
        ) : (
          <div>
            {available ? (
              <>
                <p>محصول انتخاب شده ناموجود است،</p>
                <p>گزینه های موجود را انتخاب کنید.</p>
              </>
            ) : (
              <h5 className="text-red-500">ناموجود</h5>
            )}
          </div>
        )}
      </div>
      <div>
        <div className="flex gap-2 p-2">
          {product.variety.map((item, index) => {
            return (
              <RadioButton
                value={{
                  id: item.id,
                  sub: null,
                  uid: item.uniqueId,
                  usub: null,
                }}
                key={index + 'id:' + item.id}
                group="colors"
                color={item.color}
                handler={itemSelectFunc}
                selectedOptions={selected}
              >
                {item.specification}
              </RadioButton>
            );
          })}
        </div>
        <>
          {product.variety.map((item, index) => {
            return (
              <div className="flex gap-2 p-2" key={index}>
                {item.subVariety.length > 0 &&
                  item.subVariety.map((subItem) => (
                    <RadioButton
                      key={subItem.id}
                      handler={itemSelectFunc}
                      selectedOptions={selected}
                      value={{
                        id: item.id,
                        sub: subItem.id,
                        uid: item.uniqueId,
                        usub: subItem.uniqueId,
                      }}
                      color={subItem.color}
                      group="subItems"
                    >
                      {subItem.specification}
                    </RadioButton>
                  ))}
              </div>
            );
          })}
        </>
      </div>
      <AddButton
        key={selected.uniqueSub || selected.uniqueId}
        handleAddToCart={handleAddToCart}
        isPending={addToCartFn.isPending}
        price={price}
        product={product}
        selected={selected}
      />
    </>
  );
}
