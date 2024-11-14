export interface FooteritemsProps {
  id: number;
  title: string;
  url: string;
}

export interface SocialLinksProps {
  id: number;
  title: 'Telegram' | 'Whatsapp' | 'Instagram';
  url: string;
}

export async function getFooterItems() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/footer-menu?populate=*'
  );
  const parsedData = await apiData.json();
  const footerItems: FooteritemsProps[] = parsedData.data.item;
  return footerItems;
}
export async function getSocialLinksItems() {
  const apiData = await fetch(
    process.env.BACKEND_PATH + '/social-link-menu?populate=*'
  );
  const parsedData = await apiData.json();
  const socialLinksItems: SocialLinksProps[] = parsedData.data.item;
  return socialLinksItems;
}
