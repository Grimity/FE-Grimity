import Icon from "@/components/Asset/IconTemp";
import Chip from "@/components/Chip/Chip";
import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";

import { useModal } from "@/hooks/useModal";

import styles from "./DMControls.module.scss";

interface DMControlsProps {
  isEditMode: boolean;
  isAllSelected: boolean;
  selectedChatIds: string[];
  onEditMode: () => void;
  onCloseEditMode: () => void;
  onSelectAll: () => void;
}

const DMControls = ({
  isEditMode,
  isAllSelected,
  selectedChatIds,
  onEditMode,
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
    <div className={`${styles.buttonList} ${!isEditMode ? styles.justifyEnd : ""}`}>
      {isEditMode ? (
        <>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              className={styles.hiddenCheckbox}
              checked={isAllSelected}
              onChange={onSelectAll}
            />
            <span className={styles.customCheckbox}></span>
            전체 선택
          </label>
          <div className={styles.editButtons}>
            <button
              className={styles.leaveChatButton}
              type="button"
              disabled={disabled}
              onClick={handleShowLeaveModal}
            >
              <Chip
                className={`${styles.leaveChatChip} ${disabled && styles.disabled}`}
                type="outlined-assistive"
                size="s"
                disabled={disabled}
              >
                채팅 나가기
              </Chip>
            </button>
            <button className={styles.cancelButton} type="button" onClick={onCloseEditMode}>
              <Chip
                className={styles.cancelChip}
                type="filled-assistive"
                leftIcon={<Icon icon="close" />}
                size="s"
              >
                취소
              </Chip>
            </button>
          </div>
        </>
      ) : (
        <button className={styles.button} type="button" onClick={onEditMode}>
          <Chip
            className={styles.editButton}
            type="outlined-assistive"
            leftIcon={<Icon icon="setting" />}
            size="s"
          >
            편집
          </Chip>
        </button>
      )}
    </div>
  );
};

export default DMControls;
