import { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./RefreshLoading.module.scss";
import { RefreshLoadingProps } from "./RefreshLoading.types";

const SPOKES = Array.from({ length: 8 });

export default function RefreshLoading({
  type = "basic",
  size = 24,
  className,
}: RefreshLoadingProps) {
  return (
    <span
      className={clsx(styles.spinner, styles[type], className)}
      style={{ "--loader-size": `${size}px` } as CSSProperties}
      role="status"
      aria-label="로딩 중"
    >
      {SPOKES.map((_, index) => (
        <span key={index} className={styles.spoke} />
      ))}
    </span>
  );
}
