import clsx from "clsx";
import Toggle from "@/components/common/Control/Toggle/Toggle";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";
import RadioButton from "@/components/common/Control/RadioButton/RadioButton";
import CheckMark from "@/components/common/Control/CheckMark/CheckMark";
import styles from "./ControlItem.module.scss";
import { ControlItemProps } from "./ControlItem.types";

const ROLE_MAP = {
  toggle: "switch",
  checkBox: "checkbox",
  radio: "radio",
  checkMark: "checkbox",
} as const;

export default function ControlItem({
  variant = "normal",
  type = "toggle",
  text = "",
  active = false,
  disabled = false,
  className,
  onClick,
  ...props
}: ControlItemProps) {
  const role = ROLE_MAP[type];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role={role}
      aria-checked={active}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={clsx(
        styles.controlItem,
        styles[variant],
        { [styles.disabled]: disabled },
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className={styles.text}>{text}</span>
      {type === "toggle" && <Toggle checked={active} disabled={disabled} />}
      {type === "checkBox" && <CheckBox active={active} disabled={disabled} />}
      {type === "radio" && (
        <RadioButton selected={active} disabled={disabled} />
      )}
      {type === "checkMark" && (
        <CheckMark checked={active} disabled={disabled} />
      )}
    </div>
  );
}
