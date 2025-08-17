'use client';

import { useEffect, useState } from 'react';
import { AddressProps } from '@/app/utils/schema/userProps';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation } from '@tanstack/react-query';
import {
  getPostalInformation,
  updatePostalInformation,
} from '@/app/utils/data/getUserInfo';
import NewAddressForm from './NewAddressForm';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useRouter } from 'next/navigation';
import states from '@/public/cities.json';
import { BiEdit } from 'react-icons/bi';
import SubmitButton from '../formElements/SubmitButton';
import RadioButton from '../formElements/RadioButton';
import LoadingAnimation from '../LoadingAnimation';
import { MdCancel, MdDeleteOutline } from 'react-icons/md';
import Modal from '../Modal';
import { toast } from 'react-toastify';

export default function Addresses() {
  const router = useRouter();

  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [editAddress, setEditAddress] = useState<AddressProps | null>(null);

  const { user } = useDataStore();
  const { checkoutAddress, setCheckoutAddress } = useCheckoutStore();

  const getAddressFn = useMutation({
    mutationFn: async (id: string) => {
      setCheckoutAddress(null);
      const res: {
        data: {
          id: number;
          documentId: string;
          information: AddressProps[];
        };
      } = await getPostalInformation(id);
      return res.data;
    },
    onSettled(data, error) {
      setLoading(false);
      if (data) {
        setAddresses(data.information);
      }
      if (error) toast.error('خطا در دریافت آدرس');
    },
  });

  const deleteAddressFn = useMutation({
    mutationFn: async ({ address }: { address: number }) => {
      if (Array.isArray(addresses) && addresses.length) {
        const newAddresses = [...addresses];
        const found = newAddresses.find((item) => item.id == address);
        if (found) {
          const index = newAddresses.findIndex((item) => item == found);
          if (index >= 0) {
            newAddresses.splice(index, 1);
            return newAddresses;
          }
        }
      }
    },
    onSettled(data, error) {
      setLoading(false);
      if (error) toast.error('خطا در حذف آدرس');
      if (!data) return;
      updateAddressesFn.mutate({ data });
    },
  });

  const updateAddressesFn = useMutation({
    mutationFn: async ({ data }: { data: AddressProps[] }) => {
      const res = await updatePostalInformation(
        data,
        user!.postal_information.documentId
      );
      if (res.data)
        return {
          data: res.data,
          documentId: user!.postal_information.documentId,
        };
    },
    onSettled(data, error) {
      setLoading(false);
      if (data) {
        getAddressFn.mutate(data.documentId);
        router.refresh();
      }
      if (error) {
        toast.error('خطا در بروزرسانی آدرس ها');
      }
    },
  });

  useEffect(() => {
    setCheckoutAddress(null);
  }, []);

  useEffect(() => {
    if (addresses && Array.isArray(addresses) && addresses.length) {
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
      if (!checkoutAddress) {
        setCheckoutAddress(addresses[0]);
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (user && addresses && Array.isArray(addresses) && addresses.length) {
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
    }
  }, [addresses]);

  useEffect(() => {
    if (addresses && Array.isArray(addresses) && addresses.length) {
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
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (user && user.postal_information) {
      getAddressFn.mutateAsync(user.postal_information.documentId);
      setShowTextBox(false);
    }
  }, [user]);

  if (updateAddressesFn.isPending || getAddressFn.isPending || loading)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-2" key={addresses.toString()}>
      {addresses && Array.isArray(addresses) && (
        <div className="w-full flex flex-col gap-2">
          {addresses.map((item, index) => {
            return (
              <div className="w-full" key={index}>
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
                      <div className="flex">
                        <button
                          onClick={() => {
                            setEditAddress(item);
                          }}
                          className="ml-2 text-sm text-accent-pink hover:text-accent-pink/50"
                        >
                          <BiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAddress(0);
                            setSelectedAddress(parseInt(item.id.toString()));
                            setShowDeleteModal(true);
                          }}
                          className="ml-2 text-sm text-accent-pink hover:text-accent-pink/50"
                        >
                          <MdDeleteOutline className="text-lg" />
                        </button>
                      </div>
                    )}
                  </div>
                  {editAddress == item && (
                    <NewAddressForm
                      isPending={(bool) => setLoading(bool)}
                      onSuccessFn={(checkout: AddressProps[]) => {
                        setShowTextBox(false);
                        setLoading(false);
                        setAddresses(checkout);
                        if (user)
                          getAddressFn.mutate(
                            user.postal_information.documentId
                          );
                        router.refresh();
                      }}
                      existingAddresses={addresses}
                      onCancel={() => setEditAddress(null)}
                      editModeAddress={item}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {showTextBox && (
            <NewAddressForm
              isPending={(bool) => setLoading(bool)}
              onSuccessFn={(checkout: AddressProps[]) => {
                setShowTextBox(false);
                setLoading(false);
                setAddresses(checkout);
                if (user)
                  getAddressFn.mutate(user.postal_information.documentId);
                router.refresh();
              }}
              existingAddresses={addresses}
              onCancel={() => {
                setEditAddress(null);
                setShowTextBox(false);
              }}
            />
          )}
        </div>
      )}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        {(() => {
          const selected = addresses.find((item) => item.id == selectedAddress);
          return (
            <div>
              <div>
                آیا از پاک کردن آدرس زیر اطمینان دارید؟
                <div>
                  <p>
                    <span>استان: </span>
                    {selected?.province}
                  </p>
                  <p>
                    <span>شهر: </span>
                    {selected?.city}
                  </p>
                  <p>
                    <span>آدرس: </span>
                    {selected?.address}
                  </p>
                  <p>
                    <span>کدپستی: </span>
                    {selected?.postCode}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-1">
                <SubmitButton
                  type="button"
                  className="bg-accent-yellow hover:bg-accent-yellow/50 text-foreground hover:text-foreground/80"
                  onClick={() => setShowDeleteModal(false)}
                >
                  لغو
                  <MdCancel />
                </SubmitButton>
                <SubmitButton
                  type="button"
                  className="bg-accent-pink hover:bg-accent-pink/50 "
                  onClick={() => {
                    setShowDeleteModal(false);
                    deleteAddressFn.mutate({ address: selectedAddress });
                  }}
                >
                  پاک کردن
                  <MdDeleteOutline className="text-lg" />
                </SubmitButton>
              </div>
            </div>
          );
        })()}
      </Modal>

      {!showTextBox && (
        <SubmitButton
          onClick={() => {
            setShowTextBox(true);
          }}
          className="w-fit"
          type="button"
        >
          افزودن آدرس جدید +
        </SubmitButton>
      )}
    </div>
  );
}
