import SettingsShell from "@/components/Settings/SettingsShell/SettingsShell";
import ThemeSettings from "@/components/Settings/ThemeSettings/ThemeSettings";

export default function ThemeSettingsPage() {
  return (
    <SettingsShell section="theme" metaTitle="설정 · 테마 - 그리미티">
      <ThemeSettings />
    </SettingsShell>
  );
}
