import clsx from "clsx";
import styles from "./CommissionTab.module.scss";
import { CommissionTabProps } from "./CommissionTab.types";

export default function CommissionTab({
  size = "lg",
  active = false,
  title,
  className,
  ...props
}: CommissionTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={clsx(styles.commissionTab, styles[size], { [styles.active]: active }, className)}
      {...props}
    >
      {title}
    </button>
  );
}
