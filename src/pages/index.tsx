import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useDeviceStore } from "@/states/deviceStore";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Banner from "@/components/Layout/Banner/Banner";
import Ranking from "@/components/Layout/Ranking/Ranking";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

import { serviceUrl } from "@/constants/serviceurl";

import styles from "@/styles/pages/home.module.scss";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("home-scroll");
  const { isMobile } = useDeviceStore();

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
            {!isMobile && <MainBoard type="NOTICE" />}
          </section>
          <NewFeed />
        </section>
      </div>
    </>
  );
}
