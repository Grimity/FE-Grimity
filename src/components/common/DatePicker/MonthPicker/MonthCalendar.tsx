import { useState } from "react";
import clsx from "clsx";
import { getMonth, getYear } from "date-fns";

import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";
import ListItem from "@/components/common/Cell/ListItem/ListItem";

import { MIN_SELECTABLE_DATE } from "@/components/common/DatePicker/DatePicker.types";

import styles from "@/components/common/DatePicker/DatePicker.module.scss";

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

// 선택 가능한 가장 이른 달 (2025.03)
const MIN_YEAR = getYear(MIN_SELECTABLE_DATE);
const MIN_MONTH = getMonth(MIN_SELECTABLE_DATE) + 1;

interface MonthCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  variant?: "popover" | "sheet";
}

export default function MonthCalendar({
  selectedDate,
  onSelect,
  onClose,
  variant = "popover",
}: MonthCalendarProps) {
  const isSheet = variant === "sheet";
  const today = new Date();
  const todayYear = getYear(today);
  const todayMonth = getMonth(today) + 1;

  const selectedYear = getYear(selectedDate);
  const selectedMonth = getMonth(selectedDate) + 1;

  const [displayedYear, setDisplayedYear] = useState(() => selectedYear);

  const isPrevYearDisabled = displayedYear <= MIN_YEAR;
  const isNextYearDisabled = displayedYear >= todayYear;

  const isMonthDisabled = (month: number) => {
    if (displayedYear === MIN_YEAR && month < MIN_MONTH) return true;
    if (displayedYear > todayYear) return true;
    if (displayedYear === todayYear && month > todayMonth) return true;
    return false;
  };

  const handleSelect = (month: number) => {
    onSelect(new Date(displayedYear, month - 1, 1));
    onClose();
  };

  return (
    <div className={isSheet ? styles.monthCalendarSheet : styles.monthCalendar}>
      <div className={styles.monthCalendarHeader}>
        <IconButton
          variant="normal"
          icon={<Icon name="chevron-left" size={16} color="gray-bold" />}
          aria-label="이전 연도"
          disabled={isPrevYearDisabled}
          onClick={() => setDisplayedYear((year) => year - 1)}
        />
        <span className={styles.monthCalendarYear}>{displayedYear}</span>
        <IconButton
          variant="normal"
          icon={<Icon name="chevron-right" size={16} color="gray-bold" />}
          aria-label="다음 연도"
          disabled={isNextYearDisabled}
          onClick={() => setDisplayedYear((year) => year + 1)}
        />
      </div>

      <div className={styles.monthCalendarGrid}>
        {MONTHS.map((month) => {
          const isSelected = displayedYear === selectedYear && month === selectedMonth;

          return (
            <ListItem
              key={month}
              type="pickerCard"
              text={`${month}월`}
              active={isSelected}
              disabled={isMonthDisabled(month)}
              onClick={() => handleSelect(month)}
              className={clsx(isSheet && styles.monthCellSheet)}
            />
          );
        })}
      </div>
    </div>
  );
}
