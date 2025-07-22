import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import SvgLogo from '@/public/logo.svg';
import {
  FooteritemsProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';

export default function Footer({
  FooterMenu,
  SocialLinks,
}: {
  FooterMenu: FooteritemsProps[];
  SocialLinks: SocialLinksProps[];
}) {
  const icons = {
    Instagram: <FaInstagram className="w-6 h-6" />,
    Telegram: <FaTelegram className="w-6 h-6" />,
    Whatsapp: <FaWhatsapp className="w-6 h-6" />,
  };
  const date = new Date(Date.now());
  const year = date.getFullYear();

  return (
    <footer className="min-h-[20svh] bg-yellow-300 flex flex-col justify-between w-full sticky bottom-0">
      <div className="flex flex-col md:flex-row h-full">
        <Image
          src={SvgLogo.src}
          height={SvgLogo.height}
          width={SvgLogo.width}
          alt="logo"
          className="absolute inset-0 h-full object-cover -z-10 opacity-50"
        />
        <div className="w-full h-fit px-10">
          لینک ها
          <ul className="marker:text-black list-disc list-inside">
            {FooterMenu.map((item) => (
              <li className="hover:underline" key={item.id}>
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full">
          <a href="https://me.sizpay.ir/SizPayNamad/2519D30323CEEA6750014004040000140103835">
            <img
              src="https://me.sizpay.ir/SizPayNamadImg/2519D30323CEEA6750014004040000140103835"
              className="cursor-pointer"
              alt="درگاه پرداخت"
              title=" درگاه پرداخت سيزپی"
            />
          </a>
        </div>
        <div className="w-full">
          <h3>Footer Details3</h3>
        </div>
      </div>
      <div className="flex justify-center items-center py-3">
        {SocialLinks.map(({ id, title, url }) => (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-sm flex items-center justify-center"
            aria-label={title}
          >
            {icons[title]}
          </a>
        ))}
      </div>
      <p className="text-sm gerdFont py-2 text-center bg-gray-800/80 text-white">
        © کپی رایت {year}، تمامی حقوق متعلق به مجله لمن کر می باشد.
      </p>
    </footer>
  );
}
