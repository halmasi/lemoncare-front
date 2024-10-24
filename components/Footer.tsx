import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const socialmedia = [
    {
      id: 1,
      icon: <FaInstagram className="w-6 h-6" />,
      link: "https://instagram.com",
      title: "Instagram",
    },
    {
      id: 2,
      icon: <FaTelegram className="w-6 h-6" />,
      link: "https://telegram.org",
      title: "Telegram",
    },
    {
      id: 3,
      icon: <FaWhatsapp className="w-6 h-6" />,
      link: "https://whatsapp.com",
      title: "Whatsapp",
    },
  ];

  return (
    <footer className="min-h-[20svh] bg-yellow-200 shadow-inner w-full sticky bottom-0">
      <div className="grid grid-cols-1 px-10 md:grid-cols-2 md:px-20 gap-8">
        <h3>Footer Details</h3>
      </div>

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

      <div className="flex"></div>

      <div className="text-center p-3">Copyright: 2024</div>
    </footer>
  );
}