import { useEffect } from "react";
import { useRouter } from "next/router";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SettingsNav from "@/components/Settings/SettingsNav/SettingsNav";
import { serviceUrl } from "@/constants/serviceurl";
import { useDeviceStore } from "@/states/deviceStore";

export default function SettingsIndexPage() {
  const router = useRouter();
  const isMobile = useDeviceStore((s) => s.isMobile);

  useEffect(() => {
    if (!isMobile) {
      router.replace("/settings/account");
    }
  }, [isMobile, router]);

  return (
    <AuthLayout>
      <InitialPageMeta title="설정 - 그리미티" url={`${serviceUrl}/settings`} />
      {isMobile && <SettingsNav />}
    </AuthLayout>
  );
}
