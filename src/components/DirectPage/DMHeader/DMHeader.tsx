import { useState } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";
import Icon from "@/components/Asset/IconTemp";

import styles from "./DMHeader.module.scss";

interface DMHeaderProps {
  onSearch: (value?: string) => void;
  searchKeyword?: string;
}

const DMHeader = ({ searchKeyword, onSearch }: DMHeaderProps) => {
  const [keyword, setKeyword] = useState(searchKeyword || "");

  const handleClear = () => {
    setKeyword("");
    onSearch();
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>DM</h1>

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
