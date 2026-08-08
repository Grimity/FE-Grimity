import clsx from "clsx";
import DotBadge from "@/components/common/PushBadge/DotBadge/DotBadge";
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
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHasPopup,
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      className={clsx(
        baseStyles.button,
        styles.iconButton,
        styles[variant],
        loading && baseStyles.loading,
        className
      )}
    >
      <span className={baseStyles.content}>
        {loading ? (
          <span className={`${baseStyles.spinner} ${baseStyles.spinnerSmall}`} />
        ) : badge ? (
          <DotBadge size="medium" position="topRight">
            {icon}
          </DotBadge>
        ) : (
          icon
        )}
      </span>
    </button>
  );
}
