import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./GroupSettings.module.scss";
import { GroupSettingsProps } from "./GroupSettings.types";

export default function GroupSettings({
  title,
  state = "enabled",
  isDragging,
  dragHandleProps,
  onDelete,
  className,
  ...rest
}: GroupSettingsProps) {
  const isDisabled = state === "disabled";
  const hasEdit = state === "editDelete" || state === "disabled";
  const hasDelete = state === "delete" || state === "editDelete" || state === "disabled";
  const hasDrag = state === "enabled" || state === "pressed";

  return (
    <div className={clsx(styles.root, className)} {...rest}>
      <div
        className={clsx(
          styles.field,
          (state === "pressed" || isDragging) && styles.pressed,
          isDisabled && styles.disabled,
        )}
      >
        {hasEdit && (
          <Icon
            name="pen"
            size={16}
            className={clsx(styles.penIcon, isDisabled ? styles.iconDisabled : styles.iconDefault)}
          />
        )}
        <span className={clsx(styles.title, isDisabled && styles.titleDisabled)}>{title}</span>
      </div>
      {hasDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
          disabled={isDisabled}
          aria-label="삭제"
        >
          <Icon
            name="minus-circle-fill"
            size={24}
            className={isDisabled ? styles.iconDisabled : styles.iconPositive}
          />
        </button>
      )}
      {hasDrag && (
        <div className={styles.dragHandle} {...dragHandleProps}>
          <Icon name="hamburger" size={24} color="gray-subtle" aria-label="정렬" />
        </div>
      )}
    </div>
  );
}
