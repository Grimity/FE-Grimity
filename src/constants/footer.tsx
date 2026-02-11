import { FooterIconName } from "@/components/Layout/Sidebar/SidebarFooterItem/SidebarFooterItem";

export interface FooterItem {
  route?: string;
  icon: FooterIconName;
  label: string;
  isHaveDropdown: boolean;
}

export const FOOTER_ITEMS: FooterItem[] = [
  {
    icon: "noti",
    label: "공지사항",
    isHaveDropdown: false,
    route: "/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a",
  },
  { icon: "noti", label: "안내", isHaveDropdown: true },
  { icon: "ask", label: "문의", isHaveDropdown: true },
];
