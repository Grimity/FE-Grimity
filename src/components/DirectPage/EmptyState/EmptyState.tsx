import Empty from "@/components/common/Empty/Empty";

import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  onNewMessage: () => void;
}

const EmptyState = ({ onNewMessage }: EmptyStateProps) => {
  return (
    <div className={styles.empty}>
      <Empty
        size="xl"
        iconName="illust-replay"
        title="아직 주고 받은 메시지가 없어요"
        content="다른 작가에게 사진과 메시지를 보낼 수 있어요"
        buttonLabel="새 메시지 보내기"
        buttonVariant="outline"
        onButtonClick={onNewMessage}
      />
    </div>
  );
};

export default EmptyState;
