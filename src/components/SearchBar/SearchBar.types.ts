export interface SearchBarProps {
  searchValue: string;
  placeholder?: string;
  setSearchValue: (value: string) => void;
  onSearch: (value: string) => void;
}
