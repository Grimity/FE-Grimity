import { useCallback, useEffect, useRef, useState } from "react";
import { usePopular } from "@/api/users/getPopular";
import styles from "./PopularUser.module.scss";
import Title from "@/components/Layout/Title/Title";
import Loader from "@/components/Layout/Loader/Loader";
import User from "./User/User";
import { useRecoilValue } from "recoil";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { authState } from "@/states/authState";

export default function PopularUser() {
  const { user_id } = useRecoilValue(authState);
  const { data, isLoading } = usePopular();
  const [randomUsers, setRandomUsers] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);

  // 가로 스크롤 시 세로 스크롤 막기
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (isTablet) return;

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel, isMobile]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((user) => user.id !== user_id); // 내 계정 제외
      const randomData = [...filteredData].sort(() => Math.random() - 0.5).slice(0, 5);
      setRandomUsers(randomData);
    }
  }, [data, user_id]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>인기 유저</Title>
      {isMobile || isTablet ? (
        <Swiper
          spaceBetween={isMobile ? 10 : 14}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          className={styles.swiper}
        >
          {randomUsers?.map((user) => (
            <SwiperSlide key={user.tagName} className={styles.slide}>
              <User
                id={user.id}
                url={user.url}
                name={user.name}
                image={user.image}
                followerCount={user.followerCount}
                isFollowing={user.isFollowing}
                thumbnails={user.thumbnails}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className={styles.cardContainer} ref={containerRef}>
          {randomUsers?.map((user) => (
            <div key={user.tagName} className={styles.slide}>
              <User
                id={user.id}
                url={user.url}
                name={user.name}
                image={user.image}
                followerCount={user.followerCount}
                isFollowing={user.isFollowing}
                thumbnails={user.thumbnails}
              />
            </div>
          ))}
        </div>
      )}
      <div className={styles.lastGradient} />
    </div>
  );
}
