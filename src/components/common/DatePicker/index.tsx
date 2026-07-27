import WeekPicker from "@/components/common/DatePicker/WeekPicker";
import MonthPicker from "@/components/common/DatePicker/MonthPicker";

import type DatePickerProps from "@/components/common/DatePicker/DatePicker.types";
import { DatePickerMode } from "@/components/common/DatePicker/DatePicker.types";

import styles from "@/components/common/DatePicker/DatePicker.module.scss";

export default function DatePicker({
  mode,
  selectedDate = new Date(),
  onDateChange,
}: DatePickerProps) {
  return (
    <div className={styles.container}>
      {mode === DatePickerMode.WEEK ? (
        <WeekPicker selectedDate={selectedDate} onDateChange={onDateChange} />
      ) : (
        <MonthPicker selectedDate={selectedDate} onDateChange={onDateChange} />
      )}
    </div>
  );
}
