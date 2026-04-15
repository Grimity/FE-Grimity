import clsx from "clsx";
import Avatar from "@/components/common/Avatar/Avatar";
import NumberBadge from "@/components/common/PushBadge/NumberBadge/NumberBadge";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";
import styles from "./DmList.module.scss";
import type { DmListProps } from "./DmList.types";

export default function DmList({
  active = false,
  nickname = "Nickname",
  showCheck = false,
  showNew = false,
  text = "DM message DM message",
  time = "32분 전",
  count = 1,
  onCheck,
  onClick,
  className,
}: DmListProps) {
  return (
    <div
      className={clsx(styles.item, active && styles.active, className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {showCheck && (
        <CheckBox
          active={false}
          size="medium"
          className={styles.checkbox}
          onClick={(e) => {
            e.stopPropagation();
            onCheck?.();
          }}
        />
      )}

      <div className={styles.userInfo}>
        <Avatar type="default" size="md" className={styles.avatar} />

        <div className={styles.details}>
          <div className={styles.nameRow}>
            <span className={styles.nickname}>{nickname}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.time}>{time}</span>
          </div>
          <p className={styles.lastMessage}>{text}</p>
        </div>
      </div>

      {showNew && count > 0 && (
        <NumberBadge count={count} variant="solid" className={styles.badge} />
      )}
    </div>
  );
}
