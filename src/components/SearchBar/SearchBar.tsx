import { useRouter } from "next/router";
import IconComponent from "../Asset/Icon";
import styles from "./SearchBar.module.scss";
import { SearchBarProps } from "./SearchBar.types";
import { useToast } from "@/hooks/useToast";

export default function SearchBar({ searchValue, setSearchValue, onSearch }: SearchBarProps) {
  const router = useRouter();
  const { tab } = router.query;
  const { showToast } = useToast();

  const handleClear = () => {
    setSearchValue("");
    router.push("");
    onSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      const currentTab = tab === "author" ? "author" : tab === "board" ? "board" : "feed";
      const trimmedKeyword = searchValue.trim();
      if (trimmedKeyword.length < 2) {
        showToast("두 글자 이상 입력해주세요.", "warning");
        return;
      }
      router.push(`?tab=${currentTab}&keyword=${trimmedKeyword}`, undefined, { shallow: true });
      onSearch(trimmedKeyword);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <IconComponent name="searchGray" size={24} padding={8} />
        <input
          type="text"
          placeholder="그림, 작가, 관련 작품을 검색해보세요"
          className={styles.input}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {searchValue && (
        <div onClick={handleClear}>
          <IconComponent name="xCircle" size={24} padding={8} isBtn />
        </div>
      )}
    </div>
  );
}
