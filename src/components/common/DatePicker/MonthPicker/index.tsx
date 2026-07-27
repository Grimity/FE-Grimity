import { useState } from "react";
import { getMonth } from "date-fns";

import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Icon from "@/components/common/Icon/Icon";
import Filter from "@/components/common/Filter/Filter";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import MonthCalendar from "@/components/common/DatePicker/MonthPicker/MonthCalendar";
import useDateNavigation from "@/hooks/useDateNavigation";
import { useDeviceStore } from "@/states/deviceStore";

import styles from "@/components/common/DatePicker/DatePicker.module.scss";

interface MonthPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MonthPicker({ selectedDate, onDateChange }: MonthPickerProps) {
  const { currentDate, onPrevMonth, onNextMonth, isPrevDisabled, isNextDisabled } =
    useDateNavigation(selectedDate, onDateChange, "month");

  const isMobile = useDeviceStore((state) => state.isMobile);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const closeSheet = () => setIsSheetOpen(false);

  const selectedMonthValue = String(getMonth(currentDate) + 1);
  const monthLabel = `${selectedMonthValue}월`;
  // Filter 트리거 라벨용 단일 옵션
  const monthOptions = [{ label: monthLabel, value: selectedMonthValue }];

  const renderCalendar = (onClose: () => void, variant?: "sheet") => (
    <MonthCalendar
      selectedDate={currentDate}
      onSelect={onDateChange}
      onClose={onClose}
      variant={variant}
    />
  );

  return (
    <div className={styles.row}>
      {isMobile ? (
        <>
          <button
            type="button"
            className={styles.monthTrigger}
            onClick={() => setIsSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isSheetOpen}
          >
            <span className={styles.monthTriggerLabel}>{monthLabel}</span>
            <Icon name={isSheetOpen ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          <BottomSheet isOpen={isSheetOpen} onClose={closeSheet} showCloseIcon>
            {renderCalendar(closeSheet, "sheet")}
          </BottomSheet>
        </>
      ) : (
        <Filter
          variant="text"
          options={monthOptions}
          value={selectedMonthValue}
          onChange={() => {}}
          align="left"
          renderDropdown={(close) => renderCalendar(close)}
        />
      )}

      <div className={styles.navButtons}>
        <OutlinedButton
          size="small"
          iconOnly={<Icon name="chevron-left" size={16} color="gray-bold" />}
          aria-label="이전 달"
          disabled={isPrevDisabled}
          onClick={onPrevMonth}
        />
        <OutlinedButton
          size="small"
          iconOnly={<Icon name="chevron-right" size={16} color="gray-bold" />}
          aria-label="다음 달"
          disabled={isNextDisabled}
          onClick={onNextMonth}
        />
      </div>
    </div>
  );
}
