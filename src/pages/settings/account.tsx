import SettingsShell from "@/components/Settings/SettingsShell/SettingsShell";
import AccountSettings from "@/components/Settings/AccountSettings/AccountSettings";

export default function AccountSettingsPage() {
  return (
    <SettingsShell section="account" metaTitle="설정 · 내 계정 - 그리미티">
      <AccountSettings />
    </SettingsShell>
  );
}
