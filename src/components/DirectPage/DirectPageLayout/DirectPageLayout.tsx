import { ReactNode } from "react";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import DirectPage from "@/components/DirectPage/DirectPage";
import { useDeviceStore } from "@/states/deviceStore";

interface DirectPageLayoutProps {
  rightPanel?: ReactNode;
}

const DirectPageLayout = ({ rightPanel }: DirectPageLayoutProps) => {
  const { isMobile, isTablet } = useDeviceStore();

  return (
    <AuthLayout>
      {!isMobile && !isTablet && <DirectPage />}
      {rightPanel}
    </AuthLayout>
  );
};

export default DirectPageLayout;