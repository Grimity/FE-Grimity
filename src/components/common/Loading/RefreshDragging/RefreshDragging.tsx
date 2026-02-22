import clsx from "clsx";
import styles from "./RefreshDragging.module.scss";
import { RefreshDraggingProps } from "./RefreshDragging.types";

const SPOKE_COUNT = 8;

export default function RefreshDragging({ type = "basic", className }: RefreshDraggingProps) {
  return (
    <span
      className={clsx(styles.wrapper, styles[type], className)}
      role="status"
      aria-label="로딩 중"
    >
      {Array.from({ length: SPOKE_COUNT }, (_, i) => (
        <span key={i} className={clsx(styles.spoke, styles[`spoke${i}`])} />
      ))}
    </span>
  );
}
