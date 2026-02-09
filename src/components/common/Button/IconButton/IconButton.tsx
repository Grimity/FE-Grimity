import clsx from "clsx";
import baseStyles from "../ButtonBase.module.scss";
import styles from "./IconButton.module.scss";
import { IconButtonProps } from "./IconButton.types";

export default function IconButton({
  variant = "normal",
  icon,
  badge = false,
  disabled = false,
  loading = false,
  onClick,
  onMouseDown,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      className={clsx(
        baseStyles.button,
        styles.iconButton,
        styles[variant],
        loading && baseStyles.loading,
        className
      )}
    >
      {loading && (
        <span
          className={`${baseStyles.spinner} ${baseStyles.spinnerSmall}`}
        />
      )}
      <span className={baseStyles.content}>{icon}</span>
      {badge && <span className={styles.badge} />}
    </button>
  );
}
