import Icon from "@/components/Asset/IconTemp";
import Chip from "@/components/Chip/Chip";
import styles from "./DMControls.module.scss";

interface DMControlsProps {
  isEditMode: boolean;
  isAllSelected: boolean;
  selectedChatIds: number[];
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
  return (
    <div className={`${styles.buttonList} ${!isEditMode ? styles.justifyEnd : ""}`}>
      {isEditMode ? (
        <>
          <label className={styles.selectAll}>
            <input
              type="checkbox"
              className={styles.customCheckbox}
              checked={isAllSelected}
              onChange={onSelectAll}
            />
            전체 선택
          </label>
          <div className={styles.editButtons}>
            <button className={styles.button} type="button" disabled={selectedChatIds.length === 0}>
              <Chip type="outlined-assistive" size="s" disabled={selectedChatIds.length === 0}>
                채팅 나가기
              </Chip>
            </button>
            <button className={styles.button} type="button" onClick={onCloseEditMode}>
              <Chip type="filled-assistive" leftIcon={<Icon icon="close" />} size="s">
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
