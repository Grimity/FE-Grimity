import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";

import Menu from "@/components/common/Navigation/Menu/Menu";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";

import styles from "./ActionMenu.module.scss";
import type { ActionMenuProps } from "./ActionMenu.types";

export default function ActionMenu({
  items,
  children,
  open,
  onOpenChange,
  align = "right",
  displayMode = "menu",
  className,
}: ActionMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isBottomSheet = displayMode === "bottomSheet";

  const menuItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        onClick: () => {
          onOpenChange(false);
          item.onClick?.();
        },
      })),
    [items, onOpenChange],
  );

  useEffect(() => {
    if (!open || isBottomSheet) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, isBottomSheet, onOpenChange]);

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      {children}

      {isBottomSheet ? (
        <BottomSheet isOpen={open} onClose={() => onOpenChange(false)} showCloseIcon>
          <div className={styles.sheetList}>
            {menuItems.map((item) => (
              <ListItem
                key={item.label}
                type="textLg"
                text={item.label}
                showIcon={false}
                onClick={item.onClick}
              />
            ))}
          </div>
        </BottomSheet>
      ) : (
        open && (
          <div className={clsx(styles.dropdown, styles[align])}>
            <Menu items={menuItems} />
          </div>
        )
      )}
    </div>
  );
}
