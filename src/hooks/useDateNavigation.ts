import {
  subDays,
  addDays,
  subMonths,
  addMonths,
  isBefore,
  isAfter,
  startOfDay,
  startOfMonth,
} from "date-fns";

import { MIN_SELECTABLE_DATE } from "@/components/common/DatePicker/DatePicker.types";

type DateNavigationUnit = "week" | "month";

interface UseDateNavigationReturn {
  currentDate: Date;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function useDateNavigation(
  initialDate: Date,
  onDateChange: (date: Date) => void,
  unit: DateNavigationUnit = "week",
): UseDateNavigationReturn {
  const currentDate = initialDate;

  const isPrevDisabled =
    unit === "month"
      ? !isAfter(startOfMonth(currentDate), startOfMonth(MIN_SELECTABLE_DATE))
      : !isAfter(startOfDay(currentDate), startOfDay(MIN_SELECTABLE_DATE));

  const isNextDisabled =
    unit === "month"
      ? !isBefore(startOfMonth(currentDate), startOfMonth(new Date()))
      : !isBefore(startOfDay(currentDate), startOfDay(new Date()));

  const handlePrevWeek = () => onDateChange(subDays(currentDate, 7));
  const handleNextWeek = () => onDateChange(addDays(currentDate, 7));
  const handlePrevMonth = () => onDateChange(subMonths(currentDate, 1));
  const handleNextMonth = () => onDateChange(addMonths(currentDate, 1));

  return {
    currentDate,
    isPrevDisabled,
    isNextDisabled,
    onPrevWeek: handlePrevWeek,
    onNextWeek: handleNextWeek,
    onPrevMonth: handlePrevMonth,
    onNextMonth: handleNextMonth,
  };
}

export default useDateNavigation;
