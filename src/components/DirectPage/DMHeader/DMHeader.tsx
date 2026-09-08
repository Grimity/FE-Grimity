import { useState } from "react";

import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextField from "@/components/common/Input/TextField/TextField";

import { useDeviceStore } from "@/states/deviceStore";

import styles from "./DMHeader.module.scss";

interface DMHeaderProps {
  isChatEmpty?: boolean;
  searchKeyword?: string;
  isEditMode?: boolean;
  onSearch: (value?: string) => void;
  onEditMode?: () => void;
  onNewMessage?: () => void;
}

const DMHeader = ({
  isChatEmpty,
  searchKeyword,
  isEditMode,
  onSearch,
  onEditMode,
  onNewMessage,
}: DMHeaderProps) => {
  const { isMobile } = useDeviceStore();
  const [keyword, setKeyword] = useState(searchKeyword || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value || undefined);
  };

  const handleClear = () => {
    setKeyword("");
    onSearch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>DM</h1>
        <div className={styles.headerButtons}>
          <OutlinedButton size="small" onClick={onNewMessage} disabled={isEditMode}>
            새 메시지
          </OutlinedButton>
          <OutlinedButton
            size="small"
            onClick={onEditMode}
            disabled={isEditMode || isChatEmpty}
          >
            편집
          </OutlinedButton>
        </div>
      </div>

      <TextField
        variant="search"
        size={isMobile ? "md" : "sm"}
        className={styles.search}
        placeholder="작가 이름을 검색해보세요"
        value={keyword}
        onChange={handleChange}
        onClear={handleClear}
      />
    </div>
  );
};

export default DMHeader;
