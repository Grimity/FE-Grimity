import { useState } from "react";

import SearchBar from "@/components/SearchBar/SearchBar";

import styles from "./DMHeader.module.scss";

interface DMHeaderProps {
  onSearch: (value?: string) => void;
}

const DMHeader = ({ onSearch }: DMHeaderProps) => {
  const [keyword, setKeyword] = useState("");

  const handleClear = () => {
    setKeyword("");
    onSearch();
  };
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>DM</h1>
      <SearchBar
        searchValue={keyword}
        setSearchValue={setKeyword}
        placeholder="작가 이름을 검색해 보세요"
        onSearch={onSearch}
        onClear={handleClear}
      />
    </div>
  );
};

export default DMHeader;
