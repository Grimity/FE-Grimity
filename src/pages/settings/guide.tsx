import SettingsShell from "@/components/Settings/SettingsShell/SettingsShell";
import GuideSettings from "@/components/Settings/GuideSettings/GuideSettings";

export default function GuideSettingsPage() {
  return (
    <SettingsShell section="guide" metaTitle="설정 · 이용 안내 - 그리미티">
      <GuideSettings />
    </SettingsShell>
  );
}
