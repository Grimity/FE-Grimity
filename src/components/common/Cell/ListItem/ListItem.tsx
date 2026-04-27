import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";
import RadioButton from "@/components/common/Control/RadioButton/RadioButton";
import CheckMark from "@/components/common/Control/CheckMark/CheckMark";
import styles from "./ListItem.module.scss";
import { ListItemProps } from "./ListItem.types";

export default function ListItem({
  type = "textLg",
  text,
  subText,
  icon,
  showIcon = true,
  showSubText = true,
  active = false,
  negative = false,
  disabled = false,
  onClick,
  className,
}: ListItemProps) {
  if (type === "section") {
    return (
      <div className={clsx(styles.section, className)} role="presentation">
        {text}
      </div>
    );
  }

  if (type === "rightIcon") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(styles.base, styles.rightIcon, className)}
      >
        <span>{text}</span>
        <span className={styles.rightIconRight}>
          {showSubText && subText && (
            <span className={styles.subText}>{subText}</span>
          )}
          <Icon
            name="chevron-right-tight"
            size={20}
            color={disabled ? "gray-subtler" : "gray-subtle"}
          />
        </span>
      </button>
    );
  }

  if (type === "optionCard") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          styles.base,
          styles.optionCard,
          { [styles.active]: active },
          className
        )}
      >
        <span className={styles.optionCardContent}>
          {showIcon && icon && <span className={styles.iconSlot}>{icon}</span>}
          <span className={styles.optionCardText}>{text}</span>
        </span>
        {active && !disabled && (
          <span className={styles.optionCardCheck}>
            <Icon name="check" size={24} color="primary-normal" />
          </span>
        )}
      </button>
    );
  }

  if (type === "icon") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          styles.base,
          styles.icon,
          { [styles.active]: active },
          className
        )}
      >
        {showIcon && icon && <span className={styles.iconSlot}>{icon}</span>}
        <span className={styles.optionCardText}>{text}</span>
      </button>
    );
  }

  if (type === "pickerCard") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          styles.base,
          styles.pickerCard,
          { [styles.active]: active },
          className
        )}
      >
        {text}
      </button>
    );
  }

  if (type === "textLg" || type === "textMd") {
    const typeClass = type === "textLg" ? styles.textLg : styles.textMd;

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          styles.base,
          typeClass,
          { [styles.active]: active, [styles.negative]: negative },
          className
        )}
      >
        <span className={styles.textContent}>
          <span>{text}</span>
          {active && !disabled && (
            <Icon name="check" size={24} color="primary-normal" />
          )}
        </span>
      </button>
    );
  }

  if (type === "checkBox") {
    return (
      <div
        role="checkbox"
        aria-checked={active}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        className={clsx(
          styles.base,
          styles.control,
          { [styles.disabled]: disabled },
          className
        )}
      >
        <CheckBox active={active} disabled={disabled} />
        <span>{text}</span>
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div
        role="radio"
        aria-checked={active}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        className={clsx(
          styles.base,
          styles.control,
          { [styles.disabled]: disabled },
          className
        )}
      >
        <RadioButton selected={active} disabled={disabled} />
        <span>{text}</span>
      </div>
    );
  }

  if (type === "checkMark") {
    return (
      <div
        role="checkbox"
        aria-checked={active}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        className={clsx(
          styles.base,
          styles.control,
          { [styles.disabled]: disabled },
          className
        )}
      >
        <CheckMark checked={active} disabled={disabled} />
        <span>{text}</span>
      </div>
    );
  }

  return null;
}
