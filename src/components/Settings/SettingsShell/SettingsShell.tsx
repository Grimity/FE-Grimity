import { ReactNode } from "react";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SettingsLayout from "@/components/Settings/SettingsLayout/SettingsLayout";
import { SETTINGS_NAV_ITEMS, SettingsSection } from "@/components/Settings/SettingsNav/SettingsNav";
import { serviceUrl } from "@/constants/serviceurl";

interface SettingsShellProps {
  section: SettingsSection;
  metaTitle: string;
  children: ReactNode;
}

export default function SettingsShell({ section, metaTitle, children }: SettingsShellProps) {
  const path = SETTINGS_NAV_ITEMS.find((item) => item.key === section)?.path ?? "/settings";

  return (
    <AuthLayout>
      <InitialPageMeta title={metaTitle} url={`${serviceUrl}${path}`} />
      <SettingsLayout activeKey={section}>{children}</SettingsLayout>
    </AuthLayout>
  );
}
