import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
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
    Eitaa: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        data-name="Layer 1"
        className={`w-6 h-6 fill-foreground`}
        viewBox="0 0 3584.55 3673.6"
      >
        <g id="Isolation_Mode" data-name="Isolation Mode">
          <path
            d="M1071.43,2.75H2607.66C3171,2.75,3631.82,462.91,3631.82,1026.2v493.93c-505,227-1014.43,1348.12-1756.93,1104.51-61.16,43.46-202.11,222.55-212,358.43-257.11-34.24-553.52-328.88-517.95-646.62C717,2026.91,1070.39,1455.5,1409.74,1225.51c727.32-492.94,1737.05-69,1175.39,283.45-341.52,214.31-1071.84,355.88-995.91-170.24-200.34,57.78-328.58,431.34-87.37,626-223.45,219.53-180.49,623.07,58.36,755.57,241.56-625.87,1082.31-544.08,1422-1291.2,255.57-562-123.34-1202.37-880.91-1104C1529.56,399.34,993.64,881.63,725.62,1453.64,453.68,2034,494.15,2811.15,1052.55,3202.82c657.15,460.92,1356.78,34.13,1780.52-523.68,249.77-328.78,468-693,798.75-903.37v875.72c0,563.28-460.88,1024.86-1024.16,1024.86H1071.43c-563.29,0-1024.16-460.87-1024.16-1024.16V1026.9C47.27,463.61,508.14,2.74,1071.43,2.74Z"
            transform="translate(-47.27 -2.74)"
            fillRule="evenodd"
          />
        </g>
      </svg>
    ),
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
      <div className="flex justify-center items-center py-3">
        {SocialLinks.map(({ id, title, url }) => (
          <a
            key={id}
            title={title}
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
        {/* © کپی رایت ۱۴۰۴ - {year}، تمامی حقوق متعلق به گروه لمیرو می باشد. © */}
        © کپی رایت {year}، تمامی حقوق متعلق به گروه لمیرو می باشد.
      </p>
    </footer>
  );
}
