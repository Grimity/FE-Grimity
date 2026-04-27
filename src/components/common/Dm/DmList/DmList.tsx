import clsx from "clsx";
import Highlighter from "react-highlight-words";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import Avatar from "@/components/common/Avatar/Avatar";
import NumberBadge from "@/components/common/PushBadge/NumberBadge/NumberBadge";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";

import styles from "./DmList.module.scss";
import type { DmListProps } from "./DmList.types";

const IMAGE_PLACEHOLDER = "이미지";

const formatDmDate = (date: Date | string): string => {
  if (typeof date === "string") return date;
  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return "";
  const daysAgo = differenceInDays(new Date(), target);
  if (daysAgo >= 7) return format(target, "MM월 dd일", { locale: ko });
  return formatDistanceToNow(target, { addSuffix: true, locale: ko });
};

export default function DmList({
  active = false,
  nickname = "",
  avatarUrl,
  showCheck = false,
  checked = false,
  text = "",
  hasImage = false,
  date,
  searchKeyword,
  showNew = false,
  count = 0,
  onCheck,
  onClick,
  className,
}: DmListProps) {
  const timeLabel = date ? formatDmDate(date) : "";
  const searchWords = searchKeyword ? [searchKeyword] : [];

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
          active={checked}
          size="medium"
          className={styles.checkbox}
          onClick={(e) => {
            e.stopPropagation();
            onCheck?.(!checked);
          }}
        />
      )}

      <div className={styles.userInfo}>
        <Avatar type={avatarUrl ? "photo" : "default"} src={avatarUrl} size="md" className={styles.avatar} />

        <div className={styles.details}>
          <div className={styles.nameRow}>
            <span className={styles.nickname}>
              <Highlighter
                highlightClassName={styles.highlight}
                searchWords={searchWords}
                autoEscape
                textToHighlight={nickname}
              />
            </span>
            {timeLabel && (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.time}>{timeLabel}</span>
              </>
            )}
          </div>
          <p className={styles.lastMessage}>
            {text ? (
              <Highlighter
                highlightClassName={styles.highlight}
                searchWords={searchWords}
                autoEscape
                textToHighlight={text}
              />
            ) : hasImage ? (
              IMAGE_PLACEHOLDER
            ) : null}
          </p>
        </div>
      </div>

      {showNew && count > 0 && (
        <NumberBadge count={count} variant="solid" className={styles.badge} />
      )}
    </div>
  );
}
