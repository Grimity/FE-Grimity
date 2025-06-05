import { InitialPageMeta } from "@/components/MetaData/MetaData";
import styles from "@/styles/pages/home.module.scss";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ranking from "@/components/Layout/Ranking/Ranking";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDeviceStore } from "@/states/deviceStore";

import IconComponent from "@/components/Asset/Icon";
import Link from "next/link";
import Banner from "@/components/Layout/Banner/Banner";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("home-scroll");
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();

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
        <>
          <section className={styles.FeedSection}>
            <Banner />
            <Ranking />
            <section className={styles.BoardSection}>
              <MainBoard type="ALL" />
              {!isMobile && <MainBoard type="NOTICE" />}
            </section>
            <NewFeed />
          </section>
          {isMobile && (
            <Link href="/write">
              <div className={styles.uploadButton} role="button" tabIndex={0}>
                <IconComponent name="mobileUpload" size={32} isBtn />
              </div>
            </Link>
          )}
        </>
      </div>
    </>
  );
}
