import clsx from "clsx";
import Icon from "../../Icon/Icon";
import styles from "./Navigation.module.scss";
import type { NavigationProps, NavigationPageProps, NavigationIconProps } from "./Navigation.types";

function NavigationPage({ page, active = false, className, ...props }: NavigationPageProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-current={active ? "page" : undefined}
      className={clsx(styles.page, active && styles.active, className)}
      {...props}
    >
      {page}
    </button>
  );
}

function NavigationIcon({ icon, active = false, className, ...props }: NavigationIconProps) {
  return (
    <button
      type="button"
      className={clsx(styles.icon, active && styles.active, className)}
      {...props}
    >
      {icon}
    </button>
  );
}

export default function Navigation({
  currentPage,
  totalPages,
  onPageChange,
  prevIcon,
  nextIcon,
  maxVisiblePages = 10,
  className,
}: NavigationProps) {
  const pages = Array.from({ length: Math.min(totalPages, maxVisiblePages) }, (_, i) => i + 1);

  return (
    <nav className={clsx(styles.navigation, className)} aria-label="페이지 네비게이션">
      <NavigationIcon
        icon={prevIcon ?? <Icon name="chevron-left" size={24} />}
        active={currentPage > 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
      />
      {pages.map((page) => (
        <NavigationPage
          key={page}
          page={page}
          active={currentPage === page}
          onClick={() => onPageChange(page)}
        />
      ))}
      <NavigationIcon
        icon={nextIcon ?? <Icon name="chevron-right" size={24} />}
        active={currentPage < totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
      />
    </nav>
  );
}

Navigation.Page = NavigationPage;
Navigation.Icon = NavigationIcon;
