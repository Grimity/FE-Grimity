import ICONS_TEMP, { IconList } from "@/constants/asset";
import styles from "@/components/Asset/IconTemp.module.scss";

interface IconProps {
  icon: IconList;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "2.5xl" | "3xl" | "4xl";
  className?: string;
}

const Icon = ({ icon, size = "md", className = "" }: IconProps) => {
  const iconClass = `${styles.icon} ${styles[size]} ${className}`;

  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...ICONS_TEMP[icon].svgOptions}
    >
      {ICONS_TEMP[icon].icon}
    </svg>
  );
};

export default Icon;

export type { IconList };
