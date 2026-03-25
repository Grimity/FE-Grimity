import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./Filter.module.scss";
import { FilterProps } from "./Filter.types";

export default function Filter({
  variant = "outline",
  options,
  value,
  onChange,
  disabled = false,
  className,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={clsx(styles.wrapper, className)}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={clsx(styles.filter, styles[variant])}
        onClick={handleToggle}
      >
        <span className={styles.label}>{selectedOption?.label}</span>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} />
      </button>
      {isOpen && (
        <ul role="listbox" className={styles.dropdown}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={clsx(styles.option, {
                  [styles.selected]: isSelected,
                })}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Icon name="check" size={20} color="primary-normal" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
