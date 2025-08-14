import DirectPage from "@/components/DirectPage/DirectPage";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import EmptyChatRoom from "@/components/DirectPage/EmptyChatRoom/EmptyChatRoom";

import { useDeviceStore } from "@/states/deviceStore";

const Direct = () => {
  const { isMobile } = useDeviceStore();

  return (
    <AuthLayout>
      <DirectPage />
      {!isMobile && <EmptyChatRoom />}
    </AuthLayout>
  );
};

export default Direct;
