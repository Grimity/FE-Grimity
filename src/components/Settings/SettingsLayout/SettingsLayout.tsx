import SettingsNav, { SettingsSection } from "@/components/Settings/SettingsNav/SettingsNav";

import styles from "./SettingsLayout.module.scss";

interface SettingsLayoutProps {
  activeKey: SettingsSection;
  children: React.ReactNode;
}

export default function SettingsLayout({ activeKey, children }: SettingsLayoutProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.navColumn}>
        <SettingsNav activeKey={activeKey} />
      </aside>
      <section className={styles.panel}>{children}</section>
    </div>
  );
}
