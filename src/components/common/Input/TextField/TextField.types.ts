export interface TextFieldHandle {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getElement: () => HTMLInputElement | null;
}

export type TextFieldVariant = "default" | "count" | "search" | "title";
export type TextFieldSize = "md" | "sm";
export type TextFieldStatus = "default" | "error" | "success" | "disabled";

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "children" | "prefix"
> {
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  status?: TextFieldStatus;
  maxCount?: number;
  /** 입력값 앞에 고정으로 붙는 내용. 문자열(예: "www.grimity.com/")이면 텍스트 스타일이 적용된다 */
  prefix?: React.ReactNode;
  onClear?: () => void;
}
