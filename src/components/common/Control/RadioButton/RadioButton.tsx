import clsx from "clsx";
import styles from "./RadioButton.module.scss";
import { RadioButtonProps } from "./RadioButton.types";

export default function RadioButton({
  selected = false,
  disabled = false,
  className,
  ...props
}: RadioButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      className={clsx(
        styles.radio,
        { [styles.selected]: selected },
        className
      )}
      {...props}
    >
      <div className={styles.circle}>
        <div className={styles.dot} />
      </div>
    </button>
  );
}
