import clsx from "clsx";
import styles from "./Tab.module.scss";
import { TabProps } from "./Tab.types";

export default function Tab({
  size = "lg",
  active = false,
  title,
  showNumber = true,
  number,
  className,
  ...props
}: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={clsx(styles.tab, styles[size], { [styles.active]: active }, className)}
      {...props}
    >
      <span className={styles.title}>{title}</span>
      {showNumber && <span className={styles.number}>{number}</span>}
    </button>
  );
}
