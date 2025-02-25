import { useEffect, useRef, useState } from 'react';
import CitySelector from '../formElements/CitySelector';
import SubmitButton from '../formElements/SubmitButton';
import states from '@/public/cities.json';
import InputBox from '../formElements/InputBox';
import { useMutation } from '@tanstack/react-query';
import { useDataStore } from '@/app/utils/states/useUserdata';

export default function NewAddressForm() {
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  //   const { user } = useDataStore();
  const provinceRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
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
    mutationFn: async () => {},
  });

  const submitFunction = (event: React.FormEvent<HTMLFormElement>) => {
    // if(user){
    // submitFn.mutate({
    // })
    // }
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('province'));
    console.log(data.get('city'));
    console.log(data.get('address'));
    console.log(data.get('postCode'));
    console.log(data.get('phone'));
    console.log(data.get('mobile'));
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
        </fieldset>
      )}
      <fieldset>
        <label htmlFor="address">آدرس</label>
        <textarea
          id="address"
          name="address"
          className="border h-20 overflow-y-scroll rounded-lg w-full outline-none p-1"
        />
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
      <InputBox
        flex="col"
        name="phone"
        placeholder="تلفن"
        format="text"
        className="border rounded-lg w-full"
      >
        شماره تلفن
      </InputBox>
      <InputBox
        flex="col"
        name="mobile"
        placeholder="موبایل"
        format="text"
        className="border rounded-lg w-full"
      >
        شماره همراه
      </InputBox>
      <SubmitButton>ثبت</SubmitButton>
    </form>
  );
}
