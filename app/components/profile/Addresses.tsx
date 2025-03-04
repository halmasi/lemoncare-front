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

export default function Addresses() {
  const router = useRouter();

  const [showTextBox, setShowTextBox] = useState<boolean>(false);

  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);

  const { user } = useDataStore();
  const { setCheckoutAddress, checkoutAddress } = useCheckoutStore();

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
        }
      });
  }, [addresses.length]);

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
    <div key={checkoutAddress?.address}>
      {addresses && (
        <div className="flex flex-col gap-2">
          {addresses.map((item, index) => {
            return (
              <div key={index}>
                <button
                  onClick={() => {
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
            );
          })}
        </div>
      )}
      {showTextBox && (
        <NewAddressForm
          onSuccessFn={() => {
            router.refresh();
          }}
          existingAddresses={addresses}
        />
      )}
      <button
        onClick={() => {
          setShowTextBox(true);
        }}
      >
        افزودن آدرس جدید +
      </button>
    </div>
  );
}
