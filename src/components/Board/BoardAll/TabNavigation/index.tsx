import IconComponent from "@/components/Asset/Icon";

import styles from "@/components/Board/BoardAll/TabNavigation/TabNavigation.module.scss";

interface TabNavigationProps {
  currentType: string;
  onTabChange: (type: "all" | "question" | "feedback") => void;
}

export default function TabNavigation({ currentType, onTabChange }: TabNavigationProps) {
  return (
    <section className={styles.types}>
      <button
        className={`${styles.type} ${currentType === "all" ? styles.active : ""}`}
        onClick={() => onTabChange("all")}
      >
        전체
      </button>
      <IconComponent name="dot" size={3} />
      <button
        className={`${styles.type} ${currentType === "question" ? styles.active : ""}`}
        onClick={() => onTabChange("question")}
      >
        질문
      </button>
      <IconComponent name="dot" size={3} />
      <button
        className={`${styles.type} ${currentType === "feedback" ? styles.active : ""}`}
        onClick={() => onTabChange("feedback")}
      >
        피드백
      </button>
    </section>
  );
}
