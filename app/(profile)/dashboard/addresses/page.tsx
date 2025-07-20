'use client';
import Addresses from '@/app/components/profile/Addresses';
import Title from '@/app/components/Title';

export default function AddressesPage() {
  return (
    <div className="w-full flex flex-col gap-5">
      <Title>
        <h6 className="text-accent-pink">آدرس های من</h6>
      </Title>
      <Addresses />
    </div>
  );
}
