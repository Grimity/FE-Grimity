import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";

import styles from "./PlatformMenu.module.scss";

interface PlatformMenuProps {
  value: string;
  options: string[];
  disabled?: boolean;
  onSelect: (platform: string) => void;
  /** 값과 다른 표시 문구가 필요할 때 쓴다 */
  getLabel?: (platform: string) => string;
  /** 주어지면 메뉴 대신 이 핸들러를 호출한다(모바일 BottomSheet용) */
  onTriggerClick?: () => void;
}

const MENU_GAP = 8;
const VIEWPORT_MARGIN = 8;

/**
 * 모달 스크롤 영역(overflow)에 잘리지 않도록 메뉴를 body 포털 + fixed 위치로 띄운다.
 * 아래 공간이 부족하면 트리거 위로 연다. 목록 자체는 공통 Menu를 그대로 쓴다.
 */
export default function PlatformMenu({
  value,
  options,
  disabled,
  onSelect,
  getLabel = (platform) => platform,
  onTriggerClick,
}: PlatformMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const spaceBelow = window.innerHeight - trigger.bottom - VIEWPORT_MARGIN;
    const openUp = spaceBelow < menuHeight + MENU_GAP && trigger.top > spaceBelow;
    setPosition({
      left: trigger.left,
      top: openUp ? trigger.top - MENU_GAP - menuHeight : trigger.bottom + MENU_GAP,
    });
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-label="플랫폼 선택"
        aria-expanded={open}
        onClick={() => (onTriggerClick ? onTriggerClick() : setOpen((prev) => !prev))}
      >
        <span className={clsx(styles.label, !value && styles.placeholder)}>{value ? getLabel(value) : "선택"}</span>
        <Icon name="chevron-down" size={20} className={styles.icon} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menuLayer}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
          >
            <Menu
              items={options.map((platform) => ({
                label: getLabel(platform),
                selected: value === platform,
                onClick: () => {
                  onSelect(platform);
                  close();
                },
              }))}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
