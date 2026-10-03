import { useRef, useState } from "react";
import clsx from "clsx";

import Menu from "@/components/common/Navigation/Menu/Menu";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import ListItem from "@/components/common/Cell/ListItem/ListItem";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "./ResponsiveMenu.module.scss";
import type { ResponsiveMenuProps } from "./ResponsiveMenu.types";

// 공통 Menu 항목 한 줄 높이(44)와 상하 패딩·간격을 합친 추정치. 방향 판단에만 쓴다
const MENU_ITEM_HEIGHT = 44;
const MENU_VERTICAL_SPACE = 20;

export default function ResponsiveMenu({
  trigger,
  items,
  mobileTitle,
  mobileItemType = "text",
  align = "right",
  disabled = false,
}: ResponsiveMenuProps) {
  const { isMobile } = useDeviceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // 아래 공간이 메뉴 높이보다 작고 위가 넉넉하면 위로 열어 뷰포트 밖으로 잘리지 않게 한다
  const handleMenuOpenChange = (next: boolean) => {
    if (next && triggerRef.current) {
      const { top, bottom } = triggerRef.current.getBoundingClientRect();
      const menuHeight = items.length * MENU_ITEM_HEIGHT + MENU_VERTICAL_SPACE;
      setOpensUpward(window.innerHeight - bottom < menuHeight && top > menuHeight);
    }
    setIsMenuOpen(next);
  };

  if (isMobile) {
    return (
      <>
        <div
          className={styles.triggerWrap}
          onClick={() => {
            if (disabled) return;
            setIsOpen(true);
          }}
        >
          {trigger}
        </div>
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={mobileTitle}
          showCloseIcon
        >
          <div className={mobileItemType === "option" ? styles.optionList : styles.list}>
            {items.map((item) => (
              <ListItem
                key={item.label}
                type={mobileItemType === "option" ? "optionCard" : "textLg"}
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
      trigger={
        <span ref={triggerRef} className={styles.triggerAnchor}>
          {trigger}
        </span>
      }
      open={isMenuOpen}
      onOpenChange={handleMenuOpenChange}
      wrapperClassName={clsx(opensUpward && styles.opensUpward)}
      items={items.map(({ label, onClick, selected }) => ({ label, onClick, selected }))}
      align={align}
      className={styles.desktopMenu}
      disabled={disabled}
    />
  );
}
