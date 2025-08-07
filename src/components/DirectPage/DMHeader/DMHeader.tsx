import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./DMHeader.module.scss";

interface DMHeaderProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: (value: string) => void;
}

const DMHeader = ({ searchValue, setSearchValue, onSearch }: DMHeaderProps) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>DM</h1>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        placeholder="작가 이름을 검색해 보세요"
        onSearch={onSearch}
      />
    </div>
  );
};

export default DMHeader;
