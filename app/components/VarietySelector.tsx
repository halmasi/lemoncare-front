'use client';
import { BiShoppingBag } from 'react-icons/bi';
import ProductSelectorRadioButton from './formElements/ProductSelectorRadioButton';
import { useEffect, useState } from 'react';
import DiscountTimer from './DiscountTimer';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../utils/states/useCartData';
import { useDataStore } from '../utils/states/useUserdata';
import { addToCart, getCart } from '@/app/utils/actions/cartActionMethods';
import SubmitButton from './formElements/SubmitButton';
import { logs } from '@/app/utils/miniFunctions';
import Count from './navbarComponents/Count';
import Toman from './Toman';
import { ProductProps } from '@/app/utils/schema/shopProps';
import { lowestPrice, varietyFinder } from '../utils/shopUtils';
import { cartProductSetter } from '../utils/shopUtils';
import AddToFavorites from './AddToFavorites';

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
    const findCart = cart.find(
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
      const variety = varietyFinder(
        { id: selected.uniqueId, sub: selected.uniqueSub },
        product
      );
      const inventory = variety.inventory;
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
    },
    onError: async (error) => {
      logs.error(error.message + ' ' + error.cause);
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
    inventory: number;
  }>({
    id: selected.id,
    sub: selected.sub,
    price: null,
    inventory: 0,
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
    const lessPrice = lowestPrice(product);
    if (lessPrice.price && lessPrice.id) {
      setSelected({
        id: lessPrice.id,
        sub: lessPrice.sub,
        uniqueId: lessPrice.uid,
        uniqueSub: lessPrice.usub,
      });
    } else setAvailable(false);
  }, []);

  useEffect(() => {
    const price = varietyFinder(
      {
        id: selected.uniqueId,
        sub: selected.uniqueSub,
      },
      product
    );

    setPrice({
      id: selected.id,
      sub: selected.sub,
      before: price.priceBefforDiscount,
      end: price.endOfDiscount || null,
      price: price.mainPrice,
      inventory: price.inventory,
    });
  }, [selected]);

  const handleAddToCart = (newItem: NewItemProps) => {
    cartProductSetter(newItem.id, cartProducts).then((list) =>
      setCartProducts(list)
    );

    const id = cart && cart.length ? cart[cart.length - 1].id + 1 : 1;

    if (jwt && user && cart) {
      const newCart = cart;
      newCart.push({ ...newItem, product, id });
      setCart(newCart);
      addToCartFn.mutate(newItem);
    } else if (cart) {
      const found = cart.find((item) => {
        return (
          item.product.documentId == newItem.id &&
          item.variety == newItem.variety
        );
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
        <div className="self-start flex gap-2 items-center">
          <AddToFavorites product={product} />
        </div>

        {price.price && price.inventory ? (
          <>
            {/* <h5>{product.off}</h5> */}
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
              <ProductSelectorRadioButton
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
              </ProductSelectorRadioButton>
            );
          })}
        </div>
        <>
          {product.variety.map((item, index) => {
            return (
              <div className="flex gap-2 p-2" key={index}>
                {item.subVariety.length > 0 &&
                  item.subVariety.map((subItem) => (
                    <ProductSelectorRadioButton
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
                    </ProductSelectorRadioButton>
                  ))}
              </div>
            );
          })}
        </>
      </div>
      <AddButton
        key={selected.uniqueSub || selected.uniqueId}
        handleAddToCart={handleAddToCart}
        isPending={addToCartFn.isPending || price.inventory < 1}
        price={price}
        product={product}
        selected={selected}
      />
    </>
  );
}
