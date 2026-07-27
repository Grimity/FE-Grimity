import SettingsShell from "@/components/Settings/SettingsShell/SettingsShell";
import NotificationSettings from "@/components/Settings/NotificationSettings/NotificationSettings";

export default function NotificationSettingsPage() {
  return (
    <SettingsShell section="notifications" metaTitle="설정 · 알림 - 그리미티">
      <NotificationSettings />
    </SettingsShell>
  );
}
