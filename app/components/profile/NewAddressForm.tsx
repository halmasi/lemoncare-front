import { useCallback, useEffect, useRef, useState } from 'react';
import CitySelector from '../formElements/CitySelector';
import SubmitButton from '../formElements/SubmitButton';
import states from '@/public/cities.json';
import InputBox from '../formElements/InputBox';
import { useMutation } from '@tanstack/react-query';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { addressSchema } from '@/app/utils/schema/addressFormValidation';
import { AddressProps } from '@/app/utils/schema/userProps';
import { updatePostalInformation } from '@/app/utils/data/getUserInfo';
import { useCheckoutStore } from '@/app/utils/states/useCheckoutData';
import { useRouter } from 'next/navigation';
import { cleanPhone } from '@/app/utils/miniFunctions';
import BooleanSwitch from './BooleanSwitch';

export default function NewAddressForm({
  existingAddresses,
  onSuccessFn,
  editModeAddress,
  onCancel,
}: {
  existingAddresses?: AddressProps[];
  onSuccessFn?: (data: object) => void;
  editModeAddress?: AddressProps;
  onCancel?: () => void;
}) {
  type ErrorState = {
    province?: string[];
    city?: string[];
    address?: string[];
    postCode?: string[];
    phone?: string[];
    mobile?: string[];
    firstName?: string[];
    lastName?: string[];
    server?: string[];
  };

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [province, setProvince] = useState('');
  const [provinceId, setProvinceId] = useState(0);
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState(0);
  const [errors, setErrors] = useState<ErrorState>({});
  const [defaultAddress, setDefaultAddress] = useState<boolean>(false);

  const provinceRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressReff = useRef<HTMLTextAreaElement>(null);
  const postCodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { user } = useDataStore();
  const { setCheckoutAddress, checkoutAddress } = useCheckoutStore();
  useEffect(() => {
    if (editModeAddress) {
      setProvince(editModeAddress.province);
      setCity(editModeAddress.city);
      setCityId(editModeAddress.cityCode!);
      setProvinceId(editModeAddress.provinceCode!);

      if (provinceRef.current)
        provinceRef.current.value = editModeAddress.province;
      if (cityRef.current) cityRef.current.value = editModeAddress.city;
      if (addressReff.current)
        addressReff.current.value = editModeAddress.address;
      if (postCodeRef.current)
        postCodeRef.current.value = editModeAddress.postCode.toString();
      if (nameRef.current) nameRef.current.value = editModeAddress.firstName;
      if (lastNameRef.current)
        lastNameRef.current.value = editModeAddress.lastName;
      if (phoneRef.current)
        phoneRef.current.value = editModeAddress.phoneNumber!.toString();
      if (mobileRef.current)
        mobileRef.current.value = editModeAddress.mobileNumber.toString();
      setDefaultAddress(editModeAddress.isDefault);
    }
  }, [editModeAddress]);
  useEffect(() => {
    const state = states.find((item) => item.name == province);
    const statesCity = state?.cities.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    setCities([]);
    if (statesCity) setCities(statesCity);
  }, [province]);

  const submitFn = useMutation({
    mutationFn: async ({
      province,
      city,
      address,
      postCode,
      phone,
      mobile,
      firstName,
      lastName,
    }: {
      province: string;
      city: string;
      address: string;
      postCode: number;
      phone: number;
      mobile: string;
      firstName: string;
      lastName: string;
    }) => {
      mobile = cleanPhone(mobile);
      const isValid = addressSchema.safeParse({
        province,
        city,
        address,
        postCode,
        phoneNumber: phone,
        mobileNumber: mobile,
        firstName,
        lastName,
      });
      setErrors({});
      if (!isValid.success) {
        const errorMessages = isValid.error.flatten().fieldErrors;
        setErrors({
          province: errorMessages.province || [],
          city: errorMessages.city || [],
          address: errorMessages.address || [],
          postCode: errorMessages.postCode || [],
          phone: errorMessages.phoneNumber || [],
          mobile: errorMessages.mobileNumber || [],
          firstName: errorMessages.firstName || [],
          lastName: errorMessages.lastName || [],
        });

        throw new Error();
      }

      const addressesArray: AddressProps[] = [
        {
          id: 0,
          province,
          city,
          address,
          postCode,
          phoneNumber: phone,
          mobileNumber: mobile,
          firstName,
          lastName,
          isDefault:
            existingAddresses && existingAddresses.length
              ? defaultAddress
              : true,
        },
      ];
      setCheckoutAddress({
        ...addressesArray[0],
        cityCode: cityId,
        provinceCode: provinceId,
      });
      if (editModeAddress) {
        const address = addressesArray.find((item) => item == editModeAddress);
        if (address) {
          addressesArray.splice(addressesArray.indexOf(address), 1);
        }
      }
      let editedAddresses = [...addressesArray];
      if (existingAddresses) {
        editedAddresses.push(...existingAddresses);
        if (defaultAddress) {
          const addresses: AddressProps[] = editedAddresses.map((item) => {
            if (item == addressesArray[0]) {
              return item;
            }
            return { ...item, isDefault: false };
          });
          editedAddresses = [...addresses];
        }
      }
      if (user && user.postal_information) {
        const postalInfo = await updatePostalInformation(
          editedAddresses,
          user.postal_information.documentId
        );
        return postalInfo;
      } else {
        return checkoutAddress;
      }
    },
    onSuccess: () => {
      if (onSuccessFn) onSuccessFn({ checkout: checkoutAddress });
      router.refresh();
    },
    onError: (error: { message: string[] }) => {
      setErrors((prev) => {
        const newErrors = prev;
        Object.assign(newErrors, { server: error.message });
        return newErrors;
      });
    },
  });

  const submitFunction = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const formValues = {
        province: data.get('province')?.toString() || '',
        city: data.get('city')?.toString() || '',
        address: data.get('address')?.toString() || '',
        firstName: data.get('firstName')?.toString() || '',
        lastName: data.get('lastName')?.toString() || '',
        postCode: parseInt(data.get('postCode')?.toString() || '0'),
        phone: parseInt(data.get('phone')?.toString() || '0'),
        mobile: data.get('mobile')?.toString() || '',
        isDefault: defaultAddress,
      };
      submitFn.mutate(formValues);
    },
    [user, submitFn]
  );

  return (
    <form onSubmit={submitFunction} className="flex flex-col gap-2 py-3">
      <fieldset>
        <label className="text-green-700" htmlFor="province">
          استان
        </label>
        <CitySelector
          id="province"
          placeholder="استان را انتخاب کنید"
          cities={states.map((item) => ({
            name: item.name,
            id: item.id,
          }))}
          onChangeFn={(selectedProvince, id) => {
            setProvince(selectedProvince);
            setProvinceId(id);
          }}
          className="md:w-full"
        />
        <input
          id="province"
          name="province"
          ref={provinceRef}
          key={'استان' + province}
          className="hidden"
          onChange={() => {}}
          type="text"
          value={province}
        />
        {errors.province && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.province.join('\n')}
          </p>
        )}
      </fieldset>
      {province && (
        <fieldset>
          <label className="text-green-700" htmlFor="city">
            شهر
          </label>
          <CitySelector
            key={province}
            id="city"
            placeholder="شهر را انتخاب کنید"
            cities={cities}
            onChangeFn={(selecctedCity, id) => {
              setCity(selecctedCity);
              setCityId(id);
            }}
          />
          <input
            id="city"
            name="city"
            key={'شهر' + city}
            className="hidden"
            onChange={() => {}}
            type="text"
            value={city}
            ref={cityRef}
          />
          {errors.city && (
            <p className="text-red-500 text-sm whitespace-pre-line">
              {errors.city.join('\n')}
            </p>
          )}
        </fieldset>
      )}
      <fieldset>
        <label className="text-green-700" htmlFor="address">
          آدرس
        </label>
        <textarea
          ref={addressReff}
          id="address"
          name="address"
          className="border h-20 overflow-y-scroll rounded-lg w-full outline-none p-1"
        />
        {errors.address && (
          <p className="text-red-500 text-sm whitespace-pre-line">
            {errors.address.join('\n')}
          </p>
        )}
      </fieldset>
      <InputBox
        flex="col"
        name="postCode"
        placeholder="کد پستی"
        format="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={postCodeRef}
      >
        کد پستی
      </InputBox>
      {errors.postCode && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.postCode.join('\n')}
        </p>
      )}
      <InputBox
        flex="col"
        name="firstName"
        placeholder="نام"
        format="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={nameRef}
      >
        نام
      </InputBox>
      {errors.firstName && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.firstName.join('\n')}
        </p>
      )}
      <InputBox
        flex="col"
        name="lastName"
        placeholder="نام خانوادگی"
        format="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={lastNameRef}
      >
        نام خانوادگی
      </InputBox>
      {errors.lastName && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.lastName.join('\n')}
        </p>
      )}
      <InputBox
        flex="col"
        name="phone"
        placeholder="تلفن"
        format="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={phoneRef}
      >
        شماره تلفن
      </InputBox>
      {errors.phone && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.phone.join('\n')}
        </p>
      )}
      <InputBox
        flex="col"
        name="mobile"
        placeholder="موبایل"
        format="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={mobileRef}
      >
        شماره همراه
      </InputBox>
      {errors.mobile && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.mobile.join('\n')}
        </p>
      )}
      {editModeAddress && (
        <BooleanSwitch
          isToggledOn={editModeAddress.isDefault}
          toggle={(b: boolean) => {
            setDefaultAddress(b);
          }}
        />
      )}
      <div className="flex w-full gap-2">
        <SubmitButton className="w-full">
          {editModeAddress ? 'اعمال تغییرات' : 'ثبت'}
        </SubmitButton>
        {onCancel && (
          <SubmitButton
            className="w-full bg-accent-pink"
            type="button"
            onClick={() => {
              onCancel();
            }}
          >
            لغو
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
