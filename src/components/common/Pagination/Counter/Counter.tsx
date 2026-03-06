import clsx from "clsx";
import styles from "./Counter.module.scss";
import type { CounterProps } from "./Counter.types";

export default function Counter({ current, total, size = "md", className }: CounterProps) {
  return (
    <span
      className={clsx(styles.counter, styles[size], className)}
      aria-label={`${current} / ${total}`}
    >
      <span className={styles.current}>{current}</span>
      <span className={styles.separator}>/</span>
      <span className={styles.total}>{total}</span>
    </span>
  );
}
