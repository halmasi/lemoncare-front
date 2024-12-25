import InputBox from '@/components/formElements/InputBox';
import SubmitButton from '@/components/formElements/SubmitButton';

export default function testpage() {
  return (
    <div className="flex w-full justify-center items-center pt-5 px-10 gap-2 h-svh">
      <div className="w-full md:w-3/12 flex flex-col gap-2">
        <InputBox placeholder="ایمیل" />
        <InputBox placeholder="رمزعبور" />
        <SubmitButton href="">ورود</SubmitButton>
      </div>
    </div>
  );
}
