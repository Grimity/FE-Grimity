import IconComponent from "../Asset/Icon";
import styles from "./SearchBar.module.scss";
import { SearchBarProps } from "./SearchBar.types";
import { useToast } from "@/hooks/useToast";

export default function SearchBar({
  searchValue,
  placeholder,
  setSearchValue,
  onSearch,
  onClear,
}: SearchBarProps) {
  const { showToast } = useToast();

  const handleClear = () => {
    setSearchValue("");
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      const trimmedKeyword = searchValue.trim();
      if (trimmedKeyword.length < 2) {
        showToast("두 글자 이상 입력해주세요.", "warning");
        return;
      }
      onSearch?.(trimmedKeyword);
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
          placeholder={placeholder}
          className={styles.input}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {searchValue && (
        <div onClick={handleClear}>
          <IconComponent name="searchDelete" size={24} padding={8} isBtn />
        </div>
      )}
    </div>
  );
}
