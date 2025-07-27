import { PATH_ROUTES } from "@/constants/routes";
import type { IconList } from "@/components/Asset/IconTemp";

export interface MenuItem {
  icon: IconList;
  label: string;
  route: string;
  isLogin?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  { icon: "home", label: "홈", route: PATH_ROUTES.HOME },
  { icon: "ranking", label: "랭킹", route: PATH_ROUTES.RANKING },
  { icon: "board", label: "자유\n게시판", route: PATH_ROUTES.BOARD },
  { icon: "following", label: "팔로잉", route: PATH_ROUTES.FOLLOWING, isLogin: true },
  { icon: "direct", label: "DM", route: PATH_ROUTES.DIRECT, isLogin: true },
];
