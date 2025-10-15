import Button from "@/components/Button/Button";

import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  onNewMessage: () => void;
}

const EmptyState = ({ onNewMessage }: EmptyStateProps) => {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyText}>아직 주고 받은 메세지가 없어요</p>
      <Button type="filled-primary" size="m" className={styles.emptyButton} onClick={onNewMessage}>
        새 메시지 보내기
      </Button>
    </div>
  );
};

export default EmptyState;