import Head from "next/head";

import DirectPage from "@/components/DirectPage/DirectPage";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import EmptyChatRoom from "@/components/DirectPage/EmptyChatRoom/EmptyChatRoom";
import Divider from "@/components/common/Divider/Divider";

import { useDeviceStore } from "@/states/deviceStore";

import styles from "./direct.module.scss";

const Direct = () => {
  const { isMobile } = useDeviceStore();

  return (
    <AuthLayout>
      <Head>
        <title>DM - 그리미티</title>
      </Head>
      <div className={styles.dmLayout}>
        <DirectPage />
        {!isMobile && (
          <>
            <Divider size="vertical" />
            <EmptyChatRoom />
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default Direct;
