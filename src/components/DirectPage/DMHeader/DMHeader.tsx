import { useState } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";

import styles from "./DMHeader.module.scss";

interface DMHeaderProps {
  onSearch: (value?: string) => void;
  searchKeyword?: string;
  onEditMode?: () => void;
  onNewMessage?: () => void;
  isEditMode?: boolean;
  onCloseEditMode?: () => void;
}

const DMHeader = ({
  searchKeyword,
  onSearch,
  onEditMode,
  onNewMessage,
  isEditMode,
  onCloseEditMode,
}: DMHeaderProps) => {
  const [keyword, setKeyword] = useState(searchKeyword || "");

  const handleClear = () => {
    setKeyword("");
    onSearch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>DM</h1>
        <div className={styles.headerButtons}>
          {isEditMode ? (
            <Button
              type="outlined-assistive"
              size="s"
              leftIcon={<Icon icon="close" />}
              onClick={onCloseEditMode}
            >
              닫기
            </Button>
          ) : (
            <>
              <Button
                type="outlined-assistive"
                size="s"
                leftIcon={<Icon icon="setting" />}
                onClick={onEditMode}
              >
                편집
              </Button>
              <Button type="filled-primary" size="s" onClick={onNewMessage}>
                새 메시지
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.searchContainer}>
        {searchKeyword && (
          <button className={styles.backButton} onClick={handleClear} type="button">
            <Icon icon="leftArrow" size="2xl" />
          </button>
        )}
        <SearchBar
          searchValue={keyword}
          setSearchValue={setKeyword}
          placeholder="작가 이름을 검색해 보세요"
          onSearch={onSearch}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};

export default DMHeader;
