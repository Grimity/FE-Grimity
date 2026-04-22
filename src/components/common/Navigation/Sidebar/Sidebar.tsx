import clsx from "clsx";
import Avatar from "@/components/common/Avatar/Avatar";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Sidebar.module.scss";
import type { SidebarActiveItem, SidebarProps } from "./Sidebar.types";

const MENU_ITEMS: {
  key: SidebarActiveItem;
  icon: "heart" | "bookmark";
  label: string;
}[] = [
  { key: "liked", icon: "heart", label: "좋아요한 그림" },
  { key: "saved", icon: "bookmark", label: "저장한 글" },
];

export default function Sidebar({
  size = "lg",
  username,
  handle,
  avatarSrc,
  followerCount,
  followingCount,
  activeItem,
  onLikedClick,
  onSavedClick,
  onLogoutClick,
  onTermsClick,
  onBusinessClick,
  className,
}: SidebarProps) {
  const handlers: Record<SidebarActiveItem, (() => void) | undefined> = {
    liked: onLikedClick,
    saved: onSavedClick,
  };

  return (
    <aside className={clsx(styles.sidebar, styles[size], className)}>
      <div className={styles.profile}>
        <Avatar src={avatarSrc} size="ml" />
        <div className={styles.usernameContainer}>
          <p className={styles.username}>{username}</p>
          <p className={styles.handle}>@{handle}</p>
        </div>
        <p className={styles.stats}>
          팔로워 <span className={styles.count}>{followerCount}</span>
          &nbsp;&nbsp;팔로잉 <span className={styles.count}>{followingCount}</span>
        </p>
      </div>

      <nav className={styles.menu}>
        {MENU_ITEMS.map(({ key, icon, label }) => {
          const isActive = activeItem === key;
          return (
            <button
              key={key}
              type="button"
              className={clsx(styles.menuItem, isActive && styles.menuItemActive)}
              onClick={handlers[key]}
            >
              <Icon
                name={icon}
                size={24}
                color={isActive ? "primary-normal" : "gray-normal"}
                className={styles.menuItemIcon}
              />
              <span className={styles.menuLabel}>{label}</span>
            </button>
          );
        })}
      </nav>

      <footer className={styles.footer}>
        <button type="button" className={styles.logout} onClick={onLogoutClick}>
          로그아웃
          <Icon name="out" size={16} color="gray-subtle" className={styles.logoutIcon}/>
        </button>
        <div className={styles.footerLinks}>
          <button type="button" className={styles.footerLink} onClick={onTermsClick}>
            이용약관
          </button>
          <p className={styles.footerSeparator}/>
          <button type="button" className={styles.footerLink} onClick={onTermsClick}>
            개인정보처리방침
          </button>
        </div>
        <button type="button" className={styles.footerLink} onClick={onBusinessClick}>
          사업자 정보
        </button>
        <p className={styles.copyright}>© Grimity. All rights reserved.</p>
      </footer>
    </aside>
  );
}
