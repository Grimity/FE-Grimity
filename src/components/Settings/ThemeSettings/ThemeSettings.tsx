import { useTheme, ThemeMode } from "@/hooks/useTheme";

import ListItem from "@/components/common/Cell/ListItem/ListItem";

import styles from "./ThemeSettings.module.scss";

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: "system", label: "시스템 설정 모드" },
  { key: "light", label: "밝은 모드" },
  { key: "dark", label: "어두운 모드" },
];

export default function ThemeSettings() {
  const { mode, setMode } = useTheme();

  return (
    <div className={styles.list}>
      {THEME_OPTIONS.map((option) => (
        <ListItem
          key={option.key}
          type="textLg"
          text={option.label}
          active={mode === option.key}
          onClick={() => setMode(option.key)}
        />
      ))}
    </div>
  );
}
