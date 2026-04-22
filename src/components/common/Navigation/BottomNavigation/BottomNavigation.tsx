import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import DotBadge from "@/components/common/PushBadge/DotBadge/DotBadge";
import Divider from "@/components/common/Divider/Divider";
import type { BottomNavTab, BottomNavigationProps } from "./BottomNavigation.types";
import type { IconName } from "@/components/common/Icon/Icon.types";
import styles from "./BottomNavigation.module.scss";

const NAV_ITEMS: { tab: BottomNavTab; icon: IconName; label: string }[] = [
  { tab: "home", icon: "home", label: "홈" },
  { tab: "rank", icon: "paint", label: "랭킹" },
  { tab: "following", icon: "following", label: "팔로잉" },
  { tab: "board", icon: "board", label: "자유게시판" },
  { tab: "dm", icon: "message", label: "DM" },
];

export default function BottomNavigation({
  activeTab,
  onTabChange,
  hasDmBadge = false,
  showPlus = false,
  onPlusClick,
  className,
}: BottomNavigationProps) {
  return (
    <>
      {showPlus && (
        <button
          type="button"
          className={styles.plusBtn}
          onClick={onPlusClick}
          aria-label="그림 업로드"
        >
          <Icon name="plus-thick" size={24} color="white" />
        </button>
      )}
      <Divider
        variant="secondary"
      />
      <nav className={clsx(styles.nav, className)}>
        {NAV_ITEMS.map(({ tab, icon, label }) => {
          const isActive = activeTab === tab;
          const showBadge = tab === "dm" && hasDmBadge;

          return (
            <button
              key={tab}
              type="button"
              className={clsx(styles.item, isActive && styles.active)}
              onClick={() => onTabChange(tab)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
            >
              <div className={styles.iconWrapper}>
                {showBadge ? (
                  <DotBadge size="small" position="bottomRight">
                    <Icon name={icon} size={24} color={isActive ? "gray-bold" : "gray-subtle"} />
                  </DotBadge>
                ) : (
                  <Icon name={icon} size={24} color={isActive ? "gray-bold" : "gray-subtle"} />
                )}
              </div>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
