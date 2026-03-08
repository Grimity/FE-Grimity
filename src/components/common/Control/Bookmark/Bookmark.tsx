import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Bookmark.module.scss";
import { BookmarkProps } from "./Bookmark.types";

export default function Bookmark({
  active = false,
  variant = "default",
  className,
  ...props
}: BookmarkProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        styles.bookmark,
        { [styles.active]: active, [styles.black]: variant === "black" },
        className
      )}
      {...props}
    >
      <Icon name={active ? "bookmark-fill" : "bookmark"} size={24} />
    </button>
  );
}
