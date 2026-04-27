import Icon from "@/components/common/Icon/Icon";
import styles from "./FloatingActionButton.module.scss";

interface FloatingActionButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

export default function FloatingActionButton({
  onClick,
  ariaLabel = "동작 버튼",
}: FloatingActionButtonProps) {
  return (
    <button type="button" className={styles.fab} onClick={onClick} aria-label={ariaLabel}>
      <Icon name="plus-thick" size={24} color="white" />
    </button>
  );
}
