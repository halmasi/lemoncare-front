import { useEffect, useState } from 'react';
import { AddressProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import { getPostalInformation } from '@/app/utils/data/getUserInfo';
import NewAddressForm from './NewAddressForm';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useRouter } from 'next/navigation';
import states from '@/public/cities.json';
import { BiEdit } from 'react-icons/bi';
import SubmitButton from '../formElements/SubmitButton';
import RadioButton from '../formElements/RadioButton';
import LoadingAnimation from '../LoadingAnimation';

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
      setAddresses(data.information);
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
    const defaultAddress = addresses.find((item) => item.isDefault);
    if (defaultAddress) {
      setSelectedAddress((prevSelectedAddress) => {
        if (prevSelectedAddress !== defaultAddress.id) {
          return defaultAddress.id;
        }
        return prevSelectedAddress;
      });

      const province = states.find(
        (state) => state.name === defaultAddress.province
      );
      const city = province?.cities.find(
        (city) => city.name === defaultAddress.city
      );

      const newCheckoutAddress = city
        ? { ...defaultAddress, cityCode: city.id }
        : { ...defaultAddress, cityCode: 0 };

      if (
        JSON.stringify(checkoutAddress) !== JSON.stringify(newCheckoutAddress)
      ) {
        setCheckoutAddress(newCheckoutAddress);
      }
    }
  }, [addresses]);

  useEffect(() => {
    const selectedAddressData = addresses.find(
      (item) => item.id == selectedAddress
    );
    if (selectedAddressData) {
      const province = states.find((state) => {
        return state.name == selectedAddressData.province;
      });
      const city = province?.cities.find((city) => {
        return city.name == selectedAddressData.city;
      });
      if (city) {
        setCheckoutAddress({
          ...selectedAddressData,
          cityCode: city.id,
        });
      } else {
        setCheckoutAddress({ ...selectedAddressData, cityCode: 0 });
      }
    }
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
  }, [user]);

  if (getAddressFn.isPending)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  return (
    <div className="w-full flex flex-col gap-2" key={addresses.toString()}>
      {addresses && (
        <div className="flex flex-col gap-2 w-fit">
          {addresses.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  <div className="flex w-full justify-between gap-3">
                    <div>
                      <RadioButton
                        id={item.id.toString()}
                        isSelected={selectedAddress === item.id}
                        onClick={(id) => {
                          setSelectedAddress(0);
                          setSelectedAddress(parseInt(id));
                        }}
                      >
                        <p>
                          {'استان ' +
                            item.province +
                            ' شهر ' +
                            item.city +
                            ' آدرس ' +
                            item.address +
                            ' کد پستی ' +
                            item.postCode}
                        </p>
                      </RadioButton>
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
