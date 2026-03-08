import clsx from "clsx";
import styles from "./Toggle.module.scss";
import { ToggleProps } from "./Toggle.types";

export default function Toggle({
  checked = false,
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={clsx(styles.toggle, { [styles.checked]: checked }, className)}
      {...props}
    >
      <div className={styles.thumb} />
    </button>
  );
}
