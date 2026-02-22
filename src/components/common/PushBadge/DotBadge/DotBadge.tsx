import clsx from "clsx";
import styles from "./DotBadge.module.scss";
import { DotBadgeProps } from "./DotBadge.types";

export default function DotBadge({
  size = "small",
  position = "topRight",
  children,
  className,
}: DotBadgeProps) {
  return (
    <span className={clsx(styles.wrapper, className)}>
      {children}
      <span className={clsx(styles.dot, styles[size], styles[position])} aria-hidden="true" />
    </span>
  );
}
