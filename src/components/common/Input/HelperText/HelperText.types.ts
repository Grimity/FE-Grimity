export type HelperTextStatus = "default" | "error" | "success";

export interface HelperTextProps {
  message?: string;
  status?: HelperTextStatus;
  currentCount?: number;
  maxCount?: number;
  id?: string;
  className?: string;
}
