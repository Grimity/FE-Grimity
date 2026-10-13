import { useState } from "react";

import Backdrop from "@/components/common/PopUp/Backdrop/Backdrop";
import Alert from "@/components/common/PopUp/Alert/Alert";

interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmDialog({
  title,
  description = "",
  confirmLabel,
  cancelLabel = "취소",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setIsConfirming(false);
    }
  };

  return (
    <Backdrop>
      <Alert
        variant="content"
        title={title}
        contentText={description}
        secondaryLabel={cancelLabel}
        onSecondary={onClose}
        secondaryDisabled={isConfirming}
        primaryLabel={confirmLabel}
        onPrimary={handleConfirm}
        primaryLoading={isConfirming}
        primaryDisabled={isConfirming}
      />
    </Backdrop>
  );
}
