import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Tag.module.scss";
import { TagProps } from "./Tag.types";

export default function Tag({
  size = "md",
  active = true,
  onRemove,
  icon,
  className,
  children,
  ...props
}: TagProps) {
  const hasIcon = !!icon || !!onRemove;

  return (
    <span
      className={clsx(
        styles.tag,
        styles[size],
        { [styles.active]: active, [styles.withIcon]: hasIcon },
        className
      )}
      {...props}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label="태그 삭제"
        >
          <Icon name="x-thick" size={16} />
        </button>
      ) : icon ? (
        <span className={styles.iconSlot}>{icon}</span>
      ) : null}
    </span>
  );
}
