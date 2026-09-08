import { useRouter } from "next/router";
import Head from "next/head";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import DirectPage from "@/components/DirectPage/DirectPage";
import Divider from "@/components/common/Divider/Divider";
import { useDeviceStore } from "@/states/deviceStore";

import ChatRoom from "@/components/ChatRoom/ChatRoom";

import styles from "./direct.module.scss";

const DirectChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { isMobile } = useDeviceStore();

  if (!chatId || Array.isArray(chatId)) {
    return null;
  }

  if (isMobile) {
    return (
      <AuthLayout>
        <Head>
          <title>DM - 그리미티</title>
        </Head>
        <ChatRoom chatId={chatId} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Head>
        <title>DM - 그리미티</title>
      </Head>
      <div className={styles.dmLayout}>
        <DirectPage />
        <Divider size="vertical" />
        <ChatRoom chatId={chatId} />
      </div>
    </AuthLayout>
  );
};

export default DirectChatPage;
