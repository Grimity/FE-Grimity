import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./CheckBox.module.scss";
import { CheckBoxProps } from "./CheckBox.types";

export default function CheckBox({
  active = false,
  disabled = false,
  size = "medium",
  className,
  ...props
}: CheckBoxProps) {
  const iconSize = size === "medium" ? 24 : 16;

  return (
    <button
      type="button"
      aria-checked={active}
      disabled={disabled}
      className={clsx(styles.checkbox, { [styles.active]: active }, className)}
      {...props}
    >
      <Icon
        name={active ? "check-square-fill" : "check-square"}
        size={iconSize}
      />
    </button>
  );
}
