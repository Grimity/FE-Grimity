import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./CheckMark.module.scss";
import { CheckMarkProps } from "./CheckMark.types";

export default function CheckMark({
  checked = false,
  disabled = false,
  className,
  ...props
}: CheckMarkProps) {
  return (
    <button
      type="button"
      aria-checked={checked}
      disabled={disabled}
      className={clsx(
        styles.checkmark,
        { [styles.checked]: checked },
        className
      )}
      {...props}
    >
      <Icon name="check" size={24} />
    </button>
  );
}
