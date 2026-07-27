import { useDeviceStore } from "@/states/deviceStore";

import Modal from "@/components/common/PopUp/Modal/Modal";
import GNB from "@/components/common/Navigation/GNB/GNB";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";

import styles from "./SettingsEditModal.module.scss";

interface SettingsEditModalProps {
  modalTitle: string;
  fillTitle: string;
  onClose: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  children: React.ReactNode;
}

export default function SettingsEditModal({
  modalTitle,
  fillTitle,
  onClose,
  onSave,
  saveDisabled = false,
  children,
}: SettingsEditModalProps) {
  const isDesktop = useDeviceStore((s) => s.isDesktop);

  if (isDesktop) {
    return (
      <Modal
        title={modalTitle}
        onClose={onClose}
        buttonType="double"
        secondaryLabel="닫기"
        onSecondary={onClose}
        primaryLabel="저장하기"
        onPrimary={onSave}
        primaryDisabled={saveDisabled}
      >
        {children}
      </Modal>
    );
  }

  return (
    <div className={styles.fill}>
      <GNB
        variant="three-button"
        title={modalTitle}
        onBack={onClose}
        className={styles.fillGnb}
      />
      <div className={styles.body}>
        <h2 className={styles.title}>{fillTitle}</h2>
        {children}
      </div>
      <div className={styles.footer}>
        <SolidButton
          size="regular"
          onClick={onSave}
          disabled={saveDisabled}
          className={styles.saveButton}
        >
          저장하기
        </SolidButton>
      </div>
    </div>
  );
}
