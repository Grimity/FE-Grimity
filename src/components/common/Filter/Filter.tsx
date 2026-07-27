import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";
import styles from "./Filter.module.scss";
import { FilterProps } from "./Filter.types";

export default function Filter({
  variant = "outline",
  options,
  value,
  onChange,
  disabled = false,
  className,
  align = "right",
  renderDropdown,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const menuItems = options.map((option) => ({
    label: option.label,
    selected: option.value === value,
    onClick: () => onChange(option.value),
  }));

  const trigger = (
    <button
      type="button"
      disabled={disabled}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={clsx(styles.filter, styles[variant])}
    >
      <span className={styles.label}>{selectedOption?.label}</span>
      <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} />
    </button>
  );

  return (
    <Menu
      trigger={trigger}
      items={renderDropdown ? [] : menuItems}
      content={renderDropdown ? renderDropdown(() => setIsOpen(false)) : undefined}
      align={align}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
      wrapperClassName={clsx(styles.wrapper, className)}
    />
  );
}
