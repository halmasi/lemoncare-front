'use client';

import InputBox from '@/app/components/formElements/InputBox';
import PhoneInputBox from '@/app/components/formElements/PhoneInputBox';
import SubmitButton from '@/app/components/formElements/SubmitButton';
import { useDataStore } from '@/app/utils/states/useUserdata';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function Information() {
  const { user, jwt } = useDataStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ input }: { input: string }) => {
      const response = '';
      if (!response) {
        console.log('not response');
      }
      return response;
    },
    onSuccess: async (data: any) => {
      //   const userData = await getFullUserData(data.jwt);
      queryClient.setQueryData(['user'], user?.data);
      console.log('onSuccess');
      router.push('/dashboard/information');
    },
    onError: (error: any) => {
      console.log('onError');
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = '';
    mutation.mutate({ input });
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
        <InputBox
          name="fullName"
          placeholder="نام و نام خانوادگی"
          value={user?.fullName}
        >
          نام و نام خانوادگی
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
