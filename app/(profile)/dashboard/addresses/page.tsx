'use client';
import Addresses from '@/app/components/profile/Addresses';
import Title from '@/app/components/Title';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function AddressesPage() {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-5">
      <div className="w-full flex flex-col md:flex-row">
        <Link
          href={'/dashboard'}
          className="absolute hover:text-accent-pink self-start md:self-center md:justify-self-start transition-colors w-fit p-2 border-l"
        >
          <FaArrowRightLong />
        </Link>
        <div className="w-full flex flex-col items-center justify-center text-center mb-5">
          <Title className="flex flex-col items-center justify-center text-center mb-6">
            <h6 className="text-accent-pink">آدرس های من</h6>
          </Title>
        </div>
      </div>

      <Addresses />
    </div>
  );
}
