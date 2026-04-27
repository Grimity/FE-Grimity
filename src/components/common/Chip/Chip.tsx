import clsx from "clsx";
import styles from "./Chip.module.scss";
import { ChipProps } from "./Chip.types";

export default function Chip({
  variant = "primary",
  size = "xl",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={clsx(styles.chip, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
