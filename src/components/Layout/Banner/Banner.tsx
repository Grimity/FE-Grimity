import Link from "next/link";

import styles from "@/components/Layout/Banner/Banner.module.scss";

function Banner() {
  const noticeUrl = "/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a";

  return (
    <Link href={noticeUrl}>
      <picture>
        <source media="(max-width: 767px)" srcSet="/image/main-banner-m.webp" />
        <source media="(max-width: 1023px)" srcSet="/image/main-banner-t.webp" />
        <img
          src="/image/main-banner.webp"
          loading="lazy"
          className={styles.banner}
          alt="메인 배너"
        />
      </picture>
    </Link>
  );
}

export default Banner;
