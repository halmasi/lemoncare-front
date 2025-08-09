import { useEffect, useRef, useState } from 'react';
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
import { cleanPhone } from '@/app/utils/miniFunctions';
import BooleanSwitch from './BooleanSwitch';

export default function NewAddressForm({
  existingAddresses,
  onSuccessFn,
  editModeAddress,
  onCancel,
  isPending,
}: {
  existingAddresses?: AddressProps[];
  onSuccessFn?: (data: AddressProps[]) => void;
  editModeAddress?: AddressProps;
  onCancel?: () => void;
  isPending?: (bool: boolean) => void;
}) {
  type ErrorState = {
    province: string[];
    city: string[];
    address: string[];
    postCode: string[];
    phoneNumber: string[];
    mobileNumber: string[];
    firstName: string[];
    lastName: string[];
    server: string[];
  };

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [province, setProvince] = useState('');
  const [provinceId, setProvinceId] = useState(0);
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState(0);
  const defaultErrors = {
    province: [''],
    city: [''],
    address: [''],
    postCode: [''],
    phoneNumber: [''],
    mobileNumber: [''],
    firstName: [''],
    lastName: [''],
    server: [''],
  };
  const [errors, setErrors] = useState<ErrorState>(defaultErrors);
  const [defaultAddress, setDefaultAddress] = useState<boolean>(
    editModeAddress?.isDefault || false
  );

  const provinceRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const postCodeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  const { user } = useDataStore();
  const { setCheckoutAddress } = useCheckoutStore();

  const onSubmitFn = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const province = provinceRef.current?.value || '';
      const city = cityRef.current?.value || '';
      const address = addressRef.current?.value || '';
      const firstName = nameRef.current?.value || '';
      const lastName = lastNameRef.current?.value || '';
      const postCode = postCodeRef.current?.value || '';
      const phoneNumber = phoneRef.current?.value || '0';
      const mobileNumber = mobileRef.current?.value || '';

      const fields = {
        province,
        city,
        address,
        postCode: parseInt(postCode),
        mobileNumber: cleanPhone(mobileNumber),
        firstName,
        lastName,
      };

      if (parseInt(phoneNumber) != 0)
        Object.assign(fields, { phoneNumber: parseInt(phoneNumber) });
      const isValid = addressSchema.safeParse(fields);

      if (!isValid.success) {
        setErrors({ ...defaultErrors, ...isValid.error.flatten().fieldErrors });
        return;
      }
      if (isPending) isPending(true);

      const addressesArray: AddressProps[] = [
        {
          ...fields,
          id: 0,
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

      let editedAddresses = [...addressesArray];
      if (existingAddresses) {
        editedAddresses.push(...existingAddresses);
        if (defaultAddress && editedAddresses && editedAddresses.length) {
          const addresses: AddressProps[] = editedAddresses.map((item) => {
            if (item == addressesArray[0]) {
              return item;
            }
            return {
              ...item,
              isDefault: defaultAddress ? false : item.isDefault,
            };
          });
          editedAddresses = [...addresses];
        }
      }
      if (editModeAddress) {
        const address = editedAddresses.find((item) => {
          const check = item.id == editModeAddress.id;
          return check;
        });
        if (address) {
          editedAddresses.splice(editedAddresses.indexOf(address), 1);
        }
      }
      if (user && user.postal_information) {
        await updatePostalInformation(
          editedAddresses,
          user.postal_information.documentId
        );
        return editedAddresses;
      }
    },
    onSuccess: (editedAddresses) => {
      if (isPending) isPending(false);
      if (onSuccessFn && editedAddresses) onSuccessFn(editedAddresses);
    },
  });

  useEffect(() => {
    if (editModeAddress) {
      setProvince(editModeAddress.province);
      setCity(editModeAddress.city);
      setCityId(editModeAddress.cityCode!);
      setProvinceId(editModeAddress.provinceCode!);

      if (provinceRef.current)
        provinceRef.current.value = editModeAddress.province;
      if (cityRef.current) cityRef.current.value = editModeAddress.city;
      if (addressRef.current)
        addressRef.current.value = editModeAddress.address;
      if (postCodeRef.current)
        postCodeRef.current.value = editModeAddress.postCode.toString();
      if (nameRef.current) nameRef.current.value = editModeAddress.firstName;
      if (lastNameRef.current)
        lastNameRef.current.value = editModeAddress.lastName;
      if (phoneRef.current)
        phoneRef.current.value = editModeAddress.phoneNumber?.toString() || '';
      if (mobileRef.current)
        mobileRef.current.value = editModeAddress.mobileNumber.toString();
      setDefaultAddress(editModeAddress.isDefault);
    }
  }, [editModeAddress]);

  useEffect(() => {
    if (province) {
      const state = states.find((item) => item.name == province);
      const statesCity = state?.cities.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setCities([]);
      if (statesCity) setCities(statesCity);
    }
  }, [province]);

  useEffect(() => {
    if (isPending) isPending(onSubmitFn.isPending);
  }, [isPending, onSubmitFn, onSubmitFn.isPending]);

  return (
    <form
      onSubmit={onSubmitFn.mutate}
      className="w-full flex flex-col gap-2 py-3"
    >
      <fieldset className="items-center">
        <label className="text-green-700" htmlFor="province">
          استان <span className="text-accent-pink">*</span>
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
            شهر <span className="text-accent-pink">*</span>
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
          آدرس <span className="text-accent-pink">*</span>
        </label>
        <textarea
          ref={addressRef}
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
        type="text"
        required
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
        type="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={nameRef}
        required
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
        type="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={lastNameRef}
        required
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
        name="mobile"
        placeholder="موبایل"
        type="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={mobileRef}
        required
      >
        شماره همراه
      </InputBox>
      {errors.mobileNumber && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.mobileNumber.join('\n')}
        </p>
      )}
      <InputBox
        flex="col"
        name="phone"
        placeholder="تلفن"
        type="text"
        className="border rounded-lg w-full"
        labelClassName="text-green-700"
        ref={phoneRef}
      >
        شماره تلفن ثابت
      </InputBox>
      {errors.phoneNumber && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.phoneNumber.join('\n')}
        </p>
      )}
      {errors.server && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.server.join('\n')}
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
      <>
        <div className="flex w-full gap-2">
          <SubmitButton
            type="submit"
            isPending={onSubmitFn.isPending}
            className="w-full bg-green-500 text-white"
          >
            {editModeAddress ? 'اعمال تغییرات' : 'ثبت آدرس'}
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
      </>
    </form>
  );
}
