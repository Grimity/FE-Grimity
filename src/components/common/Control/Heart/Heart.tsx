import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Heart.module.scss";
import { HeartProps } from "./Heart.types";

export default function Heart({
  active = false,
  variant = "default",
  className,
  ...props
}: HeartProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        styles.heart,
        { [styles.active]: active, [styles.black]: variant === "black" },
        className
      )}
      {...props}
    >
      <Icon name={active ? "heart-fill" : "heart"} size={24} />
    </button>
  );
}
