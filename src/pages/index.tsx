import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useDeviceStore } from "@/states/deviceStore";
import { useAuthStore } from "@/states/authStore";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Banner from "@/components/Layout/Banner/Banner";
import Ranking from "@/components/Layout/Ranking/Ranking";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";
import FloatingButton from "@/components/common/Button/FloatingButton/FloatingButton";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

import { serviceUrl } from "@/constants/serviceurl";

import styles from "@/styles/pages/home.module.scss";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("home-scroll");
  const { isMobile } = useDeviceStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("home-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("home-scroll");
    }
  }, []);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <div className={styles.container}>
        <section className={styles.FeedSection}>
          <Banner />
          <Ranking />
          <section className={styles.BoardSection}>
            <MainBoard type="ALL" />
            <MainBoard type="NOTICE" />
          </section>
          <NewFeed />
        </section>
      </div>
      {isMobile && isLoggedIn && (
        <FloatingButton
          className={styles.uploadFab}
          aria-label="그림 올리기"
          onClick={() => router.push("/write")}
        />
      )}
    </>
  );
}
