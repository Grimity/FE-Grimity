import { useRouter } from "next/router";

import ListItem from "@/components/common/Cell/ListItem/ListItem";
import Icon from "@/components/common/Icon/Icon";

import styles from "./SettingsNav.module.scss";

type IconName = React.ComponentProps<typeof Icon>["name"];

export type SettingsSection = "account" | "theme" | "notifications" | "guide" | "inquiry";

interface SettingsNavItem {
  key: SettingsSection;
  label: string;
  icon: IconName;
  path: string;
}

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  { key: "account", label: "내 계정", icon: "person", path: "/settings/account" },
  // 다크 토큰이 전 페이지에 적용될 때까지 화면 테마 메뉴 비노출
  // { key: "theme", label: "화면 테마", icon: "palette", path: "/settings/theme" },
  { key: "notifications", label: "알림", icon: "bell", path: "/settings/notifications" },
  { key: "guide", label: "이용 안내", icon: "info-circle", path: "/settings/guide" },
  { key: "inquiry", label: "문의하기", icon: "question-circle", path: "/settings/inquiry" },
];

interface SettingsNavProps {
  activeKey?: SettingsSection;
}

export default function SettingsNav({ activeKey }: SettingsNavProps) {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      {SETTINGS_NAV_ITEMS.map((item) => (
        <ListItem
          key={item.key}
          type="icon"
          text={item.label}
          icon={
            <Icon
              name={item.icon}
              size={24}
              color={activeKey === item.key ? "gray-bold" : "gray-normal"}
            />
          }
          active={activeKey === item.key}
          onClick={() => router.push(item.path)}
          className={styles.navItem}
        />
      ))}
    </nav>
  );
}
