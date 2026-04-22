import { useState, useRef, useEffect } from "react";
import Divider from "@/components/common/Divider/Divider";
import styles from "./Menu.module.scss";
import { MenuProps } from "./Menu.types";
import clsx from "clsx";

export default function Menu({ items, trigger, align = "right", className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const list = (
    <ul className={clsx(styles.menu, className)} role="menu">
      {items.map((item, i) => (
        <>
          <li
            key={i}
            role="menuitem"
            tabIndex={0}
            className={styles.item}
            onClick={() => {
              item.onClick?.();
              if (trigger) setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                item.onClick?.();
                if (trigger) setOpen(false);
              }
            }}
          >
            {item.label}
          </li>
          {item.borderBottom && (
            <li key={`divider-${i}`} role="separator" className={styles.divider}>
              <Divider variant="secondary" />
            </li>
          )}
        </>
      ))}
    </ul>
  );

  if (!trigger) return list;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>
      {open && (
        <div className={clsx(styles.menuContainer, styles[align])}>{list}</div>
      )}
    </div>
  );
}
