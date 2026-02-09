import clsx from "clsx";
import baseStyles from "../ButtonBase.module.scss";
import styles from "./TextButton.module.scss";
import { TextButtonProps } from "./TextButton.types";

export default function TextButton({
  variant = "primary",
  size = "regular",
  children,
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  onClick,
  onMouseDown,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: TextButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      className={clsx(
        baseStyles.button,
        styles.text,
        styles[variant],
        styles[size],
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
        {iconLeft}
        {children}
        {iconRight}
      </span>
    </button>
  );
}
