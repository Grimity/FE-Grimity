import { useState } from "react";
import clsx from "clsx";

import Menu from "@/components/common/Navigation/Menu/Menu";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "./ResponsiveMenu.module.scss";
import type { ResponsiveMenuProps } from "./ResponsiveMenu.types";

export default function ResponsiveMenu({
  trigger,
  items,
  mobileTitle,
  align = "right",
}: ResponsiveMenuProps) {
  const { isMobile } = useDeviceStore();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className={styles.triggerWrap} onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={mobileTitle}
          showCloseIcon
        >
          <div className={styles.list}>
            {items.map((item) => (
              <ListItem
                key={item.label}
                type="textLg"
                text={item.label}
                active={item.selected}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <Menu
      trigger={trigger}
      items={items.map(({ label, onClick, selected }) => ({ label, onClick, selected }))}
      align={align}
      className={clsx(styles.desktopMenu)}
    />
  );
}
