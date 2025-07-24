import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
// import Image from 'next/image';
// import SvgLogo from '@/public/logo.svg';
import {
  FooteritemsProps,
  SocialLinksProps,
} from '@/app/utils/schema/menuProps';
import Title from './Title';

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
  const year = date.toLocaleString('fa-IR', { year: 'numeric' });

  const enamadCode = `<img src="https://trustseal.enamad.ir/logo.aspx?id=629535&Code=lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v" width="100" height="110" code="lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v"
  onclick="window.open(&quot;https://trustseal.enamad.ir/?id=629535&Code=lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v;, &quot;Popup&quot;,&quot;toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30&quot;)"
  alt="enamad">`;
  // const enamadCode = `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=629535&Code=lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=629535&Code=lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v' alt='' style='cursor:pointer' code='lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v'></a>`;

  return (
    <footer className="min-h-[20svh] bg-accent-pink/30 flex flex-col justify-between w-full sticky bottom-0">
      <div className="flex flex-col lg:flex-row h-full gap-5 px-10 lg:px-28 text-gray-700">
        <div className="w-full h-fit">
          <Title>
            <h6 className="text-accent-pink">لینک ها</h6>
          </Title>
          <ul className="flex flex-col marker:text-accent-green list-disc gap-1 list-outside">
            {FooterMenu.map((item) => (
              <Link key={item.id} className="w-full" href={item.url}>
                <li className="hover:underline w-full bg-gray-50/20 p-1">
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="w-full flex flex-col items-center">
          <Title className="self-start">
            <h6 className="text-accent-pink">نماد های اعتماد</h6>
          </Title>
          <div className="w-full flex flex-wrap gap-3 justify-center">
            <a
              target="_blank"
              className=""
              href="https://me.sizpay.ir/SizPayNamad/2519D30323CEEA6750014004040000140103835"
            >
              <img
                src="https://me.sizpay.ir/SizPayNamadImg/2519D30323CEEA6750014004040000140103835"
                className="cursor-pointer"
                alt="درگاه پرداخت"
                title=" درگاه پرداخت سيزپی"
              />
            </a>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=629535&Code=lJ3C6Fespz4JRhuMgyoLXnSgalPsVt8v"
              dangerouslySetInnerHTML={{ __html: enamadCode }}
            />
          </div>
        </div>
        <div className="w-full">
          <Title>
            <h6 className="text-accent-pink">درباره لمیرو</h6>
          </Title>
          <p>
            تیم لمیرو با هدف تلاش برای بهبود سلامت پوست و مو مشتریان و همچنین
            توزیع محصولات مراقبت از پوست و مو باکیفیت، در تابستان سال ۱۴۰۴ شروع
            به کار نموده است.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-gray-700">تماس با ما</p>
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
      </div>
      <p className="text-sm gerdFont py-2 text-center bg-gray-800/80 text-white">
        {/* © کپی رایت ۱۴۰۴ - {year}، تمامی حقوق متعلق به گروه لمیرو می باشد. © */}
        © کپی رایت {year}، تمامی حقوق متعلق به گروه لمیرو می باشد.
      </p>
    </footer>
  );
}
