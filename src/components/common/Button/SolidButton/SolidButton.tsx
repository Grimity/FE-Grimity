import clsx from "clsx";
import baseStyles from "../ButtonBase.module.scss";
import styles from "./SolidButton.module.scss";
import { SolidButtonProps } from "./SolidButton.types";

export default function SolidButton({
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
}: SolidButtonProps) {
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
        styles.solid,
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
