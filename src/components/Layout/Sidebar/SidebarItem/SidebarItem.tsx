import Icon, { IconList } from "@/components/Asset/IconTemp";

import styles from "@/components/Layout/Sidebar/SidebarItem/SidebarItem.module.scss";

interface SidebarItemProps {
  icon: IconList;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, onClick, isActive }: SidebarItemProps) => {
  return (
    <div className={`${styles.sidebarItem} ${isActive ? styles.active : ""}`} onClick={onClick}>
      <div className={styles.wrapper}>
        <Icon icon={icon} size="lg" className={styles.icon} />
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
};

export default SidebarItem;
