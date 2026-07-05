import Filter from "@/components/common/Filter/Filter";
import TextField from "@/components/common/Input/TextField/TextField";

import { SortOption, SORT_OPTIONS } from "@/components/Board/BoardAll/constants";

import styles from "@/components/Board/BoardAll/SearchSection/SearchSection.module.scss";

interface SearchSectionProps {
  searchBy: SortOption;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearchKeyDown: (e: React.KeyboardEvent) => void;
  onSortChange: (option: SortOption) => void;
}

export default function SearchSection({
  searchBy,
  keyword,
  onKeywordChange,
  onSearchKeyDown,
  onSortChange,
}: SearchSectionProps) {
  return (
    <div className={styles.search}>
      <Filter
        options={SORT_OPTIONS}
        value={searchBy}
        onChange={(value) => onSortChange(value as SortOption)}
      />
      <TextField
        className={styles.textField}
        variant="search"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onKeyDown={onSearchKeyDown}
      />
    </div>
  );
}
