import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import SvgLogo from '@/public/logo.svg';
import {
  FooteritemsProps,
  getFooterItems,
  getSocialLinksItems,
  SocialLinksProps,
} from '@/utils/footer';

export default async function Footer() {
  const icons = {
    Instagram: <FaInstagram className="w-6 h-6" />,
    Telegram: <FaTelegram className="w-6 h-6" />,
    Whatsapp: <FaWhatsapp className="w-6 h-6" />,
  };
  const date = new Date(Date.now());
  const year = date.getFullYear();
  const FooterMenu: FooteritemsProps[] = await getFooterItems();
  const SocialLinks: SocialLinksProps[] = await getSocialLinksItems();

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
        <div className="w-full h-fit px-2">
          {FooterMenu.map((item) => (
            <ul key={item.id}>
              <li>
                <Link href={item.url} className="text-blue-700">
                  {item.title}
                </Link>
              </li>
            </ul>
          ))}
        </div>
        <div className="w-full">
          <h3>Footer Details2</h3>
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
            className="mx-4 flex items-center justify-center"
            aria-label={title}
          >
            {icons[title]}
          </a>
        ))}
      </div>
      <p className="text-center bg-gray-800/80 text-white">Copyright {year}</p>
    </footer>
  );
}
