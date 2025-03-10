'use client';

import InputBox from '@/app/components/formElements/InputBox';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { requestData } from '@/app/utils/data/dataFetch';
import { updateUserInformation } from '@/app/utils/data/getUserInfo';
import { cleanPhone } from '@/app/utils/miniFunctions';
import { updateUserInformationSchema } from '@/app/utils/schema/formValidation';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function Information() {
  const { user, jwt } = useDataStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (inputUserData: {
      fullName?: string;
      username?: string;
      email?: string;
    }) => {
      if (user && user.id && jwt) {
        const response = await updateUserInformation(
          user.id,
          jwt,
          inputUserData
        );
        if (!response) {
          console.log('not response');
        }
        return response;
      } else {
        console.error('error document id ');
        return;
      }
    },
    onSuccess: async (data: any) => {
      console.log('onSuccess : ', data);
      useDataStore.setState({ user: data });
      router.push('/dashboard/information');
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputUserData = {
      fullName: formData.get('fullName')?.toString() || '',
      username: cleanPhone(formData.get('username')?.toString() || ''),
      email: formData.get('email')?.toString() || '',
    };
    const validation = updateUserInformationSchema.safeParse(inputUserData);
    if (!validation.success) {
      console.error(validation.error.format());
      return;
    }
    mutation.mutate(inputUserData);
  };
  return (
    <>
      <div className="flex ">information page</div>;
      <form className="flex flex-col w-5/12" onSubmit={handleSubmit}>
        <PhoneInputBox
          name="username"
          placeholder="شماره تلفن"
          value={user?.username?.slice(2)}
        >
          شماره تلفن
        </PhoneInputBox>
        <InputBox name="fullName" placeholder="نام کامل" value={user?.fullName}>
          نام کامل
        </InputBox>
        <InputBox name="email" placeholder="آدرس ایمیل" value={user?.email}>
          آدرس ایمیل
        </InputBox>
        <SubmitButton disabled={mutation.isPending}>
          {mutation.isPending ? 'در حال ذخیره...' : 'ثبت'}
        </SubmitButton>
      </form>
    </>
  );
}
