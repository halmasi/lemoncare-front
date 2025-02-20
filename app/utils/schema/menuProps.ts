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

export interface SubMenuProps {
  id: number;
  title: string;
  url: string;
}

export interface SubMenuProps {
  id: number;
  documentId: string;
  name: string;
  width: number;
  height: number;
  url: string;
}

export interface MenuProps {
  id: number;
  title: string;
  url: string;
  subMenu: SubMenuProps[] | [];
  image: SubMenuProps | null;
}
