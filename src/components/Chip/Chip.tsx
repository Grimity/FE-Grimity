import styles from "./Chip.module.scss";
import { ChipProps } from "./Chip.types";

export default function Chip({
  children,
  type = "filled-primary",
  size = "m",
  unselected = false,
  leftIcon,
  rightIcon,
  className,
  disabled = false,
}: ChipProps) {
  const classNames = `${styles.chip} ${styles[type]} ${styles[size]} ${
    unselected ? styles.unselected : ""
  } ${className} ${disabled ? styles.disabled : ""}`;

  return (
    <div className={classNames} aria-disabled={disabled}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      {children}
      {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
    </div>
  );
}
