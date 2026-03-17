export type FilterVariant = "outline" | "text";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterProps {
  variant?: FilterVariant;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}
