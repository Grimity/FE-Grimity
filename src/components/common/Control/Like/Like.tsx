import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Like.module.scss";
import { LikeProps } from "./Like.types";

export default function Like({
  active = false,
  variant = "default",
  className,
  ...props
}: LikeProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        styles.like,
        { [styles.active]: active, [styles.black]: variant === "black" },
        className
      )}
      {...props}
    >
      <Icon name={active ? "like-fill" : "like"} size={24} />
    </button>
  );
}
