import { useRouter } from "next/router";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import DirectPage from "@/components/DirectPage/DirectPage";
import { useDeviceStore } from "@/states/deviceStore";

import ChatRoom from "@/components/ChatRoom/ChatRoom";

const DirectChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { isMobile } = useDeviceStore();

  if (isMobile) {
    return (
      <AuthLayout>
        <ChatRoom chatId={chatId} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <DirectPage />
      <ChatRoom chatId={chatId} />
    </AuthLayout>
  );
};

export default DirectChatPage;
