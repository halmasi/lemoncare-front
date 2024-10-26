import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

import SvgLogo from '@/public/logo.svg'

export default function Footer() {
  const socialmedia = [
    {
      id: 1,
      icon: <FaInstagram className="w-6 h-6" />,
      link: 'https://instagram.com',
      title: 'Instagram',
    },
    {
      id: 2,
      icon: <FaTelegram className="w-6 h-6" />,
      link: 'https://telegram.org',
      title: 'Telegram',
    },
    {
      id: 3,
      icon: <FaWhatsapp className="w-6 h-6" />,
      link: 'https://whatsapp.com',
      title: 'Whatsapp',
    },
  ]

  const date = new Date(Date.now())
  const year = date.getFullYear()

  return (
    <footer className="min-h-[20svh] bg-yellow-300 flex flex-col justify-between w-full sticky bottom-0">
      <div className="flex flex-col md:flex-row h-full">
        <Image
          src={SvgLogo.src}
          height={SvgLogo.height}
          width={SvgLogo.width}
          alt="logo"
          className="absolute h-full object-cover -z-10 opacity-50"
        />
        <div className="w-full h-fit">
          <h3>Footer Details</h3>
        </div>
        <div className="w-full text-center justify-between">
          <div className="flex justify-center items-center py-3">
            {socialmedia.map(({ id, icon, link, title }) => (
              <Link
                key={id}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 flex items-center justify-center"
                aria-label={title}
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full">
          <h3>Footer Details</h3>
        </div>
      </div>
      <p className="text-center bg-gray-800/80 text-white">Copyright {year}</p>
    </footer>
  )
}
