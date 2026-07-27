import SettingsShell from "@/components/Settings/SettingsShell/SettingsShell";
import InquirySettings from "@/components/Settings/InquirySettings/InquirySettings";

export default function InquirySettingsPage() {
  return (
    <SettingsShell section="inquiry" metaTitle="설정 · 문의하기 - 그리미티">
      <InquirySettings />
    </SettingsShell>
  );
}
