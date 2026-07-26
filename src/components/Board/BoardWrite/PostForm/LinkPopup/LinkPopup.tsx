import { useEffect, useState } from "react";

import Modal from "@/components/common/PopUp/Modal/Modal";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import Input from "@/components/common/Input/Input/Input";

import { useDeviceStore } from "@/states/deviceStore";

import styles from "./LinkPopup.module.scss";

interface LinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, label: string) => void;
}

export default function LinkPopup({ isOpen, onClose, onSubmit }: LinkPopupProps) {
  const isMobile = useDeviceStore((state) => state.isMobile);

  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setLabel("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSubmittable = url.trim().length > 0;

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit(url.trim(), label.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fields = (
    <div className={styles.fields} onKeyDown={handleKeyDown}>
      <Input
        label="링크 주소"
        textFieldProps={{
          placeholder: "https://www.grimity.com",
          name: "url",
          inputMode: "url",
          autoComplete: "url",
          spellCheck: false,
          value: url,
          onChange: (e) => setUrl(e.target.value),
        }}
      />
      <Input
        label="링크 명"
        textFieldProps={{
          placeholder: "링크 주소 대신 보일 내용을 입력해주세요",
          name: "linkLabel",
          autoComplete: "off",
          value: label,
          onChange: (e) => setLabel(e.target.value),
        }}
      />
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="링크 추가"
        showCloseIcon
        buttonType="double"
        secondaryLabel="닫기"
        onSecondary={onClose}
        primaryLabel="완료"
        onPrimary={handleSubmit}
        primaryDisabled={!isSubmittable}
      >
        {fields}
      </BottomSheet>
    );
  }

  return (
    <Modal
      title="링크 추가"
      onClose={onClose}
      buttonType="double"
      secondaryLabel="닫기"
      onSecondary={onClose}
      primaryLabel="완료"
      onPrimary={handleSubmit}
      primaryDisabled={!isSubmittable}
    >
      {fields}
    </Modal>
  );
}
