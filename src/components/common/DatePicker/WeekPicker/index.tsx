import { subDays, isToday } from "date-fns";

import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Icon from "@/components/common/Icon/Icon";
import useDateNavigation from "@/hooks/useDateNavigation";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/common/DatePicker/DatePicker.module.scss";

interface WeekPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function WeekPicker({ selectedDate, onDateChange }: WeekPickerProps) {
  const { currentDate, onPrevWeek, onNextWeek, isPrevDisabled, isNextDisabled } = useDateNavigation(
    selectedDate,
    onDateChange,
    "week",
  );

  return (
    <div className={styles.row}>
      <span className={styles.date}>
        {formattedDate(subDays(currentDate, 7))} -{" "}
        {isToday(currentDate) ? "오늘" : formattedDate(currentDate)}
      </span>

      <div className={styles.navButtons}>
        <OutlinedButton
          size="small"
          iconOnly={<Icon name="chevron-left" size={16} color="gray-bold" />}
          aria-label="이전 주"
          disabled={isPrevDisabled}
          onClick={onPrevWeek}
        />
        <OutlinedButton
          size="small"
          iconOnly={<Icon name="chevron-right" size={16} color="gray-bold" />}
          aria-label="다음 주"
          disabled={isNextDisabled}
          onClick={onNextWeek}
        />
      </div>
    </div>
  );
}
