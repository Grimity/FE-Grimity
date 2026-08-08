import Tab from "@/components/common/SegmentedControl/Tab/Tab";

import { useDeviceStore } from "@/states/deviceStore";

import styles from "@/components/Board/BoardAll/TabNavigation/TabNavigation.module.scss";

interface TabNavigationProps {
  currentType: string;
  onTabChange: (type: "all" | "normal" | "question" | "feedback") => void;
}

const TABS = [
  { type: "all", label: "전체" },
  { type: "normal", label: "일반" },
  { type: "question", label: "질문" },
  { type: "feedback", label: "피드백" },
] as const;

export default function TabNavigation({ currentType, onTabChange }: TabNavigationProps) {
  const { isMobile } = useDeviceStore();

  return (
    <section className={styles.types} role="tablist">
      {TABS.map(({ type, label }) => (
        <Tab
          key={type}
          size={isMobile ? "sm" : "lg"}
          title={label}
          showNumber={false}
          active={currentType === type}
          onClick={() => onTabChange(type)}
        />
      ))}
    </section>
  );
}
