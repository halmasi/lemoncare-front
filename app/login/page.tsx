import InputBox from '@/components/formElements/InputBox';

export default function testpage() {
  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-svh">
      <div className="w-full md:w-3/12 flex flex-col gap-2">
        <InputBox placeholder="ایمیل" />
        <InputBox placeholder="رمزعبور" />
      </div>
    </div>
  );
}
