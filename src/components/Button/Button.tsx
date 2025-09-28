import styles from "@/components/Button/Button.module.scss";
import type { ButtonProps } from "@/components/Button/Button.types";

export default function Button({
  children,
  type = "filled-primary",
  size = "m",
  disabled = false,
  onClick,
  onMouseDown,
  leftIcon,
  rightIcon,
  width,
  className,
}: ButtonProps) {
  let classNames = `${styles.button} ${styles[type]} ${styles[size]} ${className}`;

  if (disabled) {
    classNames += ` ${styles.disabled}`;
  }

  return (
    <button className={classNames} disabled={disabled} onClick={onClick} onMouseDown={onMouseDown} style={{ width }}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      {children}
      {rightIcon && <div className={styles.icon}>{rightIcon}</div>}
    </button>
  );
}
