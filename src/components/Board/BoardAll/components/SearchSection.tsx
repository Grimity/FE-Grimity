import { useState } from "react";
import styles from "../BoardAll.module.scss";
import Dropdown from "@/components/Dropdown/Dropdown";
import Icon from "@/components/Asset/IconTemp";
import { SortOption, SORT_OPTIONS } from "../constants";

interface SearchSectionProps {
  searchBy: SortOption;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: () => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
  onSortChange: (option: SortOption) => void;
}

export default function SearchSection({
  searchBy,
  keyword,
  onKeywordChange,
  onSearch,
  onSearchKeyDown,
  onSortChange,
}: SearchSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  return (
    <div className={styles.search}>
      <div className={styles.dropdown}>
        <Dropdown
          menuItems={SORT_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
            onClick: () => onSortChange(option.value),
          }))}
          onOpenChange={handleDropdownToggle}
          trigger={
            <button className={styles.dropdownBtn}>
              {SORT_OPTIONS.find((option) => option.value === searchBy)?.label || "제목+내용"}
              <Icon
                icon="chevronDown"
                size="sm"
                className={`${styles.chevron} ${isDropdownOpen ? styles.rotate : ""}`}
              />
            </button>
          }
        />
      </div>
      <div className={styles.searchbarContainer}>
        <input
          placeholder="검색어를 입력해주세요"
          className={styles.input}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        <button onClick={onSearch} className={styles.searchBtn}>
          <Icon icon="search" size="2xl" className={styles.searchIcon} />
        </button>
      </div>
    </div>
  );
}
