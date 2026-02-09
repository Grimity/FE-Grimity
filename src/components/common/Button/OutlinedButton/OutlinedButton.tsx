import clsx from "clsx";
import baseStyles from "../ButtonBase.module.scss";
import styles from "./OutlinedButton.module.scss";
import { OutlinedButtonProps } from "./OutlinedButton.types";

export default function OutlinedButton({
  size = "regular",
  children,
  iconLeft,
  iconRight,
  iconOnly,
  disabled = false,
  loading = false,
  onClick,
  onMouseDown,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: OutlinedButtonProps) {
  const isIconOnly = !!iconOnly;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      className={clsx(
        baseStyles.button,
        styles.outlined,
        styles[size],
        isIconOnly && styles.iconOnly,
        loading && baseStyles.loading,
        className
      )}
    >
      {loading && (
        <span
          className={clsx(baseStyles.spinner, size === "small" && baseStyles.spinnerSmall)}
        />
      )}
      <span className={baseStyles.content}>
        {isIconOnly ? (
          iconOnly
        ) : (
          <>
            {iconLeft}
            {children}
            {iconRight}
          </>
        )}
      </span>
    </button>
  );
}
