import Filter from "@/components/common/Filter/Filter";
import TextField from "@/components/common/Input/TextField/TextField";

import { useDeviceStore } from "@/states/deviceStore";

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
  const { isMobile } = useDeviceStore();

  return (
    <div className={styles.search}>
      <Filter
        options={SORT_OPTIONS}
        value={searchBy}
        align="left"
        onChange={(value) => onSortChange(value as SortOption)}
        displayMode={isMobile ? "bottomSheet" : "menu"}
        bottomSheetTitle="검색 필터"
      />
      <TextField
        className={styles.textField}
        variant="search"
        size="sm"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onKeyDown={onSearchKeyDown}
      />
    </div>
  );
}
