import { useEffect, useRef, useState } from 'react';
import CitySelector from '../formElements/CitySelector';
import SubmitButton from '../formElements/SubmitButton';
import states from '@/public/cities.json';
import InputBox from '../formElements/InputBox';
import { Mutation, useMutation } from '@tanstack/react-query';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { addressSchema } from '@/app/utils/schema/addressFormValidation';
import { AddressProps } from '@/app/utils/schema/userProps';
import { updatePostalInformation } from '@/app/utils/data/getUserInfo';

export default function NewAddressForm({
  existingAddresses,
  onSuccessFn,
}: {
  existingAddresses?: AddressProps[];
  onSuccessFn?: (data: object) => void;
}) {
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const { user } = useDataStore();
  const provinceRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{
    province: string[];
    city: string[];
    address: string[];
    postCode: string[];
    phone: string[];
    mobile: string[];
    firstName: string[];
    lastName: string[];
    server: string[];
  }>({
    province: [],
    city: [],
    address: [],
    postCode: [],
    phone: [],
    mobile: [],
    firstName: [],
    lastName: [],
    server: [],
  });
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
      const isValid = addressSchema.safeParse({
        province,
        city,
        address,
        postCode,
        phone,
        mobile,
        firstName,
        lastName,
      });
      if (!isValid.success) {
        setErrors({
          province: [],
          city: [],
          address: [],
          postCode: [],
          phone: [],
          mobile: [],
          firstName: [],
          lastName: [],
          server: [],
        });
        const error = isValid.error.flatten().fieldErrors;
        if (error.province)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { province: error.province });
            return newErrors;
          });
        if (error.city)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { city: error.city });
            return newErrors;
          });
        if (error.address)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { address: error.address });
            return newErrors;
          });
        if (error.postCode)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { postCode: error.postCode });
            return newErrors;
          });
        if (error.phoneNumber)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { phone: error.phoneNumber });
            return newErrors;
          });
        if (error.mobileNumber)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { mobile: error.mobileNumber });
            return newErrors;
          });
        if (error.firstName)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { firstName: error.firstName });
            return newErrors;
          });
        if (error.lastName)
          setErrors((prev) => {
            const newErrors = prev;
            Object.assign(newErrors, { lastName: error.lastName });
            return newErrors;
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
          isDefault: false,
        },
      ];
      if (existingAddresses) {
        addressesArray.push(...existingAddresses);
      }
      if (user && user.postal_information) {
        const postalInfo = await updatePostalInformation(
          addressesArray,
          user.postal_information.documentId
        );
        return postalInfo;
      }
    },
    onSuccess: (data) => {
      if (onSuccessFn) onSuccessFn(data);
    },
    onError: (error: { message: string[] }) => {
      setErrors((prev) => {
        const newErrors = prev;
        Object.assign(newErrors, { server: error.message });
        return newErrors;
      });
    },
  });

  const submitFunction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const province = data.get('province')?.toString() || '';
    const city = data.get('city')?.toString() || '';
    const address = data.get('address')?.toString() || '';
    const firstName = data.get('firstName')?.toString() || '';
    const lastName = data.get('lastName')?.toString() || '';
    const postCode = parseInt(data.get('postCode')?.toString() || '0');
    const phone = parseInt(data.get('phone')?.toString() || '0');
    const mobile = data.get('mobile')?.toString() || '';
    if (user)
      submitFn.mutate({
        province,
        city,
        address,
        postCode,
        phone,
        mobile,
        firstName,
        lastName,
      });
  };

  return (
    <form onSubmit={submitFunction} className="flex flex-col gap-2 py-3">
      <fieldset>
        <label htmlFor="province">استان</label>
        <CitySelector
          id="province"
          placeholder="استان را انتخاب کنید"
          cities={states.map((item) => ({
            name: item.name,
            id: item.id,
          }))}
          onChange={(selecctedProvince) => setProvince(selecctedProvince)}
          className="md:w-full"
        />
        <input
          id="province"
          name="province"
          ref={provinceRef}
          key={province}
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
          <label htmlFor="city">شهر</label>
          <CitySelector
            key={province}
            id="city"
            placeholder="شهر را انتخاب کنید"
            cities={cities}
            onChange={(selecctedCity) => setCity(selecctedCity)}
          />
          <input
            id="city"
            name="city"
            ref={cityRef}
            key={city}
            className="hidden"
            onChange={() => {}}
            type="text"
            value={city}
          />
          {errors.city && (
            <p className="text-red-500 text-sm whitespace-pre-line">
              {errors.city.join('\n')}
            </p>
          )}
        </fieldset>
      )}
      <fieldset>
        <label htmlFor="address">آدرس</label>
        <textarea
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
      >
        شماره همراه
      </InputBox>
      {errors.mobile && (
        <p className="text-red-500 text-sm whitespace-pre-line">
          {errors.mobile.join('\n')}
        </p>
      )}
      <SubmitButton>ثبت</SubmitButton>
    </form>
  );
}
