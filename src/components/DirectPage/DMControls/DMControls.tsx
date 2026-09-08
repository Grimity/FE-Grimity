import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";
import CheckBox from "@/components/common/Control/CheckBox/CheckBox";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import Divider from "@/components/common/Divider/Divider";

import { useModal } from "@/hooks/useModal";

import styles from "./DMControls.module.scss";

interface DMControlsProps {
  isAllSelected: boolean;
  selectedChatIds: string[];
  onCloseEditMode: () => void;
  onSelectAll: () => void;
}

const DMControls = ({
  isAllSelected,
  selectedChatIds,
  onCloseEditMode,
  onSelectAll,
}: DMControlsProps) => {
  const { openModal } = useModal();

  const disabled = selectedChatIds.length === 0;

  const handleShowLeaveModal = () => {
    if (disabled) return;
    openModal((close) => <ChatLeave selectedChatIds={selectedChatIds} close={close} />, {
      className: styles.leaveModal,
    });
  };

  return (
    <div className={styles.actionBar}>
      <div
        className={styles.selectAll}
        role="button"
        tabIndex={0}
        aria-pressed={isAllSelected}
        onClick={onSelectAll}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectAll();
          }
        }}
      >
        <CheckBox active={isAllSelected} size="medium" tabIndex={-1} aria-hidden />
        <span className={styles.selectAllText}>전체 선택</span>
      </div>

      <div className={styles.actions}>
        <TextButton
          variant="assistive"
          size="regular"
          disabled={disabled}
          onClick={handleShowLeaveModal}
        >
          채팅방 나가기
        </TextButton>
        <Divider size="vertical" className={styles.divider} />
        <TextButton variant="assistive" size="regular" onClick={onCloseEditMode}>
          아니요
        </TextButton>
      </div>
    </div>
  );
};

export default DMControls;
