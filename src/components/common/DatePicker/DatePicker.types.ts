export enum DatePickerMode {
  WEEK = "week",
  MONTH = "month",
}

// 선택 가능한 가장 이른 날짜 (2025.03.01). 주간/월간 최소 경계의 단일 소스.
export const MIN_SELECTABLE_DATE = new Date(2025, 2, 1);

interface DatePickerProps {
  mode: DatePickerMode;
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default DatePickerProps;
