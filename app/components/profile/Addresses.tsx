import { useEffect, useState } from 'react';
import { AddressProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { getPostalInformation } from '@/app/utils/data/getUserInfo';
import {
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from 'react-icons/io5';
import NewAddressForm from './NewAddressForm';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useRouter } from 'next/navigation';

import states from '@/public/cities.json';
import { BiEdit } from 'react-icons/bi';
import SubmitButton from '../formElements/SubmitButton';

export default function Addresses() {
  const router = useRouter();

  const [showTextBox, setShowTextBox] = useState<boolean>(false);

  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [editAddress, setEditAddress] = useState<AddressProps | null>(null);

  const { user } = useDataStore();
  const { checkoutAddress, setCheckoutAddress } = useCheckoutStore();

  const getAddressFn = useMutation({
    mutationFn: async (id: string) => {
      const res: {
        data: {
          id: number;
          documentId: string;
          information: AddressProps[];
        };
      } = await getPostalInformation(id);
      return res.data;
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
    if (addresses && addresses.length)
      addresses.map((item) => {
        if (item.isDefault) {
          setSelectedAddress(item.id);
          //find cityCode in states
          const province = states.find((state) => {
            return state.name == item.province;
          });
          const city = province?.cities.find((city) => {
            return city.name == item.city;
          });
          if (city) {
            setCheckoutAddress({
              ...item,
              cityCode: city.id,
            });
          } else {
            setCheckoutAddress({ ...item, cityCode: 0 });
          }
        }
      });
  }, [addresses]);

  useEffect(() => {
    addresses.find((item) => {
      if (item.id == selectedAddress) {
        const province = states.find((state) => {
          return state.name == item.province;
        });
        const city = province?.cities.find((city) => {
          return city.name == item.city;
        });
        if (city) {
          setCheckoutAddress({
            ...item,
            cityCode: city.id,
          });
        } else {
          setCheckoutAddress({ ...item, cityCode: 0 });
        }
        return item;
      }
    });
  }, [selectedAddress]);

  useEffect(() => {
    if (user && user.postal_information) {
      getUserAddresses(user.postal_information.documentId);
      setShowTextBox(false);
    } else if (checkoutAddress) {
      setAddresses([checkoutAddress]);
      setShowTextBox(false);
    } else {
      setShowTextBox(true);
    }
  }, [user, checkoutAddress]);

  return (
    <div className="w-full flex flex-col gap-2" key={checkoutAddress?.address}>
      {addresses && (
        <div className="flex flex-col gap-2 w-fit">
          {addresses.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  <div className="flex w-full justify-between gap-3">
                    <div>
                      <button
                        onClick={() => {
                          setSelectedAddress(0);
                          setSelectedAddress(item.id);
                        }}
                        className="flex items-center p-1 bg-white border rounded-lg h-fit text-foreground hover:text-foreground/80"
                      >
                        <div className="text-2xl px-2">
                          {selectedAddress == item.id ? (
                            <IoRadioButtonOnOutline className="fill-accent-pink" />
                          ) : (
                            <IoRadioButtonOffOutline />
                          )}
                        </div>
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
                    {(!editAddress || editAddress != item) && (
                      <button
                        onClick={() => {
                          setEditAddress(item);
                        }}
                        className="ml-2 text-sm text-accent-pink hover:text-accent-pink/50"
                      >
                        <BiEdit className="text-lg" />
                      </button>
                    )}
                  </div>
                  {editAddress == item && (
                    <NewAddressForm
                      onSuccessFn={() => {
                        router.refresh();
                      }}
                      existingAddresses={addresses}
                      onCancel={() => setEditAddress(null)}
                      editModeAddress={item}
                    />
                  )}
                </div>
                {showTextBox && (
                  <NewAddressForm
                    onSuccessFn={() => {
                      router.refresh();
                    }}
                    existingAddresses={addresses}
                    onCancel={() => setEditAddress(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      <SubmitButton
        onClick={() => {
          setShowTextBox(true);
        }}
        className="w-fit"
        type="button"
      >
        افزودن آدرس جدید +
      </SubmitButton>
    </div>
  );
}
