import { useState } from "react";

import { isBefore, startOfMonth } from "date-fns";

import Icon from "@/components/Asset/IconTemp";
import Button from "@/components/Button/Button";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import MonthListContent from "@/components/DatePicker/MonthPicker/MonthListContent";

import useDateNavigation from "@/hooks/useDateNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useDeviceStore } from "@/states/deviceStore";

import { formattedDate } from "@/utils/formatDate";

import styles from "@/components/DatePicker/DatePicker.module.scss";

interface MonthPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

function MonthPicker({ selectedDate, onDateChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentDate, onPrevMonth, onNextMonth, isPrevDisabled, isNextDisabled } =
    useDateNavigation(selectedDate, onDateChange);

  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();

  const handleToggleMonthList = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMonthList = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          type="outlined-assistive"
          leftIcon={<Icon icon="chevronLeft" />}
          className={`${styles.iconButton} ${styles.prevButton}`}
          disabled={isPrevDisabled}
          onClick={onPrevMonth}
        />

        <Button
          type="text-assistive"
          className={`${styles.date} ${styles.month}`}
          leftIcon={<Icon icon="calendar" className={styles.calendarIcon} />}
          rightIcon={
            <Icon
              icon="chevronDown"
              size="sm"
              className={`${styles.icon} ${isOpen ? styles.open : ""}`}
            />
          }
          onClick={handleToggleMonthList}
        >
          {formattedDate(currentDate, "M")}월
        </Button>

        <Button
          type="outlined-assistive"
          leftIcon={<Icon icon="chevronRight" />}
          className={`${styles.iconButton} ${styles.nextButton}`}
          disabled={isNextDisabled}
          onClick={onNextMonth}
        />
      </div>

      {isMobile ? (
        <BottomSheet isOpen={isOpen} onClose={handleCloseMonthList}>
          <MonthListContent
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            onMonthSelect={handleCloseMonthList}
            isMobile
          />
        </BottomSheet>
      ) : (
        <div className={`${styles.monthList} ${isOpen ? styles.open : ""}`}>
          <MonthListContent
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            onMonthSelect={handleCloseMonthList}
            isMobile={false}
          />
        </div>
      )}
    </>
  );
}

export default MonthPicker;
