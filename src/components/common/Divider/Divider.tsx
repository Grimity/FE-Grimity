import clsx from "clsx";
import styles from "./Divider.module.scss";
import { DividerProps } from "./Divider.types";

export default function Divider({
  size = "normal",
  variant = "primary",
  className,
}: DividerProps) {
  return (
    <hr
      className={clsx(styles.divider, styles[size], styles[variant], className)}
      aria-hidden="true"
    />
  );
}
