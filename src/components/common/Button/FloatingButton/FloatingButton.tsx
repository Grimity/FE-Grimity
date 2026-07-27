import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import styles from "./FloatingButton.module.scss";
import { FloatingButtonProps } from "./FloatingButton.types";

/**
 * 화면 위에 떠 있는 원형 액션 버튼(FAB). 기본은 plus 아이콘이며 모바일 그림 올리기
 * 진입점 등에 사용한다. 고정 위치는 사용처에서 className으로 지정한다.
 */
export default function FloatingButton({
  icon,
  disabled = false,
  onClick,
  onMouseDown,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: FloatingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      className={clsx(styles.fab, className)}
    >
      {icon ?? <Icon name="plus" size={24} color="white" />}
    </button>
  );
}
