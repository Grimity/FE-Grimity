import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";

import SidebarItem, { BaseIconName } from "@/components/Layout/Sidebar/SidebarItem/SidebarItem";
import FooterSection from "@/components/Layout/FooterSection/FooterSection";

import { MENU_ITEMS } from "@/constants/menu";
import { PATH_ROUTES } from "@/constants/routes";

import styles from "@/components/Layout/Sidebar/Sidebar.module.scss";

const Sidebar = () => {
  const { isLoggedIn } = useAuthStore((state) => state);
  const router = useRouter();

  const menuItems = isLoggedIn
    ? [...MENU_ITEMS, { icon: "following", label: "팔로잉", route: PATH_ROUTES.FOLLOWING }]
    : MENU_ITEMS;

  const handleItemClick = (route: string) => {
    router.push(route);
  };

  const isItemActive = (route: string) => {
    const currentPath = router.pathname;

    if (currentPath === route) return true;
    if (route === PATH_ROUTES.BOARD && currentPath.startsWith("/posts/")) return true;

    return false;
  };

  return (
    <nav className={styles.container}>
      <div className={styles.menu}>
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon as BaseIconName}
            label={item.label}
            onClick={() => handleItemClick(item.route)}
            isActive={isItemActive(item.route)}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <FooterSection />
      </div>
    </nav>
  );
};

export default Sidebar;
