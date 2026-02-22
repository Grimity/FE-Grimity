import clsx from "clsx";
import styles from "./NumberBadge.module.scss";
import { NumberBadgeProps } from "./NumberBadge.types";

export default function NumberBadge({ count, variant = "solid", className }: NumberBadgeProps) {
  const displayCount = count > 99 ? "99+" : String(count);

  return (
    <span
      className={clsx(styles.badge, styles[variant], className)}
      aria-label={`${count}개 알림`}
    >
      {displayCount}
    </span>
  );
}
