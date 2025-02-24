'use client';

import SubmitButton from '@/app/components/formElements/SubmitButton';
import Toman from '@/app/components/Toman';
import { getPostalInformation } from '@/app/utils/data/getUserInfo';
import { AddressProps } from '@/app/utils/schema/userProps';
import { useCartStore } from '@/app/utils/states/useCartData';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import states from '@/app/utils/data/cities.json';
import CitySelector from '@/app/components/formElements/CitySelector';

export default function page() {
  const { cart, cartProducts } = useCartStore();
  const { jwt, user, setUser } = useDataStore();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalBeforePrice, setTotalBeforePrice] = useState<number>(0);
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [showTextBox, setShowTextBox] = useState<boolean>(false);

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  const getAddressFn = useMutation({
    mutationFn: async (id: string) => {
      const res: {
        id: number;
        documentId: string;
        information: AddressProps[];
      } = await getPostalInformation(id);
      return res;
    },
    onSuccess: (data) => {
      data.information.map((item) => {
        setAddresses((prev) => {
          const pre = prev;
          pre.push(item);
          return pre;
        });
      });
    },
  });

  const getUserAddresses = (documentId: string) => {
    getAddressFn.mutate(documentId);
  };

  useEffect(() => {
    if (user && user.postal_information) {
      getUserAddresses(user.postal_information.documentId);
      setShowTextBox(false);
    } else setShowTextBox(true);
  }, [user]);

  useEffect(() => {
    const state = states.find((item) => item.name == province);
    const statesCity = state?.cities.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    setCities([]);
    if (statesCity) setCities(statesCity);
  }, [province]);

  useEffect(() => {
    setTotalBeforePrice(0);
    setTotalPrice(0);
    cart.forEach((cartItem) => {
      let priceBefore = 0;
      let priceAfter = 0;

      const product = cartProducts.find(
        (searchProduct) =>
          searchProduct.documentId == cartItem.product.documentId
      );

      if (product) {
        product.variety.forEach((varieties) => {
          if (cartItem.variety.id == varieties.uniqueId)
            if (!cartItem.variety.sub) {
              priceAfter = varieties.mainPrice;
              priceBefore = varieties.priceBeforeDiscount;
            } else {
              varieties.subVariety.forEach((sub) => {
                if (sub.uniqueId == cartItem.variety.sub) {
                  priceAfter = sub.mainPrice;
                  priceBefore = sub.priceBefforDiscount;
                }
              });
            }
        });
        setTotalPrice((prev) => prev + priceAfter * cartItem.count);
        setTotalBeforePrice((prev) => prev + priceBefore * cartItem.count);
      }
    });
  }, [cart]);
  if (!totalPrice) return <div>loading</div>;
  return (
    <>
      <div className="w-full justify-start">
        <div className="w-full md:w-5/12 p-2 md:p-5 rounded-lg bg-gray-50/50 border min-h-svh">
          <div className="text-center flex flex-wrap gap-2 border-b items-center justify-center">
            <h6>مجموع خرید:</h6>
            <div className="flex md:pr-5 items-center justify-center gap-2">
              <p className="line-through text-xl text-gray-500">
                {totalBeforePrice / 10}
              </p>
              <Toman className="fill-accent-green text-accent-green">
                <p>
                  <strong className="text-3xl">
                    {(totalPrice / 10).toLocaleString('fa-IR')}
                  </strong>
                </p>
              </Toman>
            </div>
          </div>
          <h6>انتخاب آدرس:</h6>
          {addresses && (
            <div className="flex flex-col gap-2">
              {addresses.map((item, index) => (
                <div key={index}>
                  <button className="bg-white border rounded-lg h-fit text-foreground hover:text-foreground/80">
                    {'استان ' +
                      item.province +
                      ' شهر ' +
                      item.city +
                      ' آدرس ' +
                      item.address +
                      ' کد پستی ' +
                      item.postCode}
                  </button>
                </div>
              ))}
            </div>
          )}
          {showTextBox && (
            <div className="flex flex-col gap-2 py-3">
              <fieldset>
                <label htmlFor="province">استان</label>
                <CitySelector
                  id="province"
                  placeholder="استان را انتخاب کنید"
                  cities={states.map((item) => ({
                    name: item.name,
                    id: item.id,
                  }))}
                  onChange={(selecctedProvince) =>
                    setProvince(selecctedProvince)
                  }
                />
              </fieldset>

              {province && (
                <fieldset>
                  <label htmlFor="city">شهرستان</label>
                  <CitySelector
                    id="city"
                    placeholder="شهر را انتخاب کنید"
                    cities={cities}
                    onChange={(selecctedCity) => setCity(selecctedCity)}
                  />
                </fieldset>
              )}
              <fieldset>
                <label htmlFor="address">آدرس</label>
                <textarea
                  id="address"
                  className="border h-20 overflow-y-scroll rounded-lg w-full"
                />
              </fieldset>
              <fieldset>
                <label htmlFor="postCode">کد پستی</label>
                <input
                  type="text"
                  id="postCode"
                  className="border rounded-lg w-full"
                />
              </fieldset>
              <SubmitButton>ثبت</SubmitButton>
            </div>
          )}
          <button
            onClick={() => {
              setShowTextBox(true);
            }}
          >
            افزودن آدرس جدید +
          </button>
        </div>
      </div>
    </>
  );
}
