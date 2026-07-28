import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { usePopular, type PopularUserResponse } from "@/api/users/getPopular";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useAuthStore } from "@/states/authStore";

import Title from "@/components/Layout/Title/Title";
import User from "@/components/RankingPage/PopularUser/User/User";

import styles from "@/components/RankingPage/PopularUser/PopularUser.module.scss";

export default function PopularUser() {
  const user_id = useAuthStore((state) => state.user_id);
  const { data, isLoading } = usePopular();
  useGlobalLoading(isLoading);
  const [randomUsers, setRandomUsers] = useState<PopularUserResponse[]>([]);
  const divRef = usePreventRightClick<HTMLDivElement>();

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((user) => user.id !== user_id);
      const randomData = [...filteredData].sort(() => Math.random() - 0.5).slice(0, 5);
      setRandomUsers(randomData);
    }
  }, [data, user_id]);

  if (isLoading) return null;

  return (
    <div className={styles.container} ref={divRef}>
      <Title>인기 작가</Title>
      <Swiper spaceBetween={16} slidesPerView="auto" className={styles.swiper}>
        {randomUsers?.map((user) => (
          <SwiperSlide key={user.id} className={styles.slide}>
            <User
              id={user.id}
              url={user.url}
              name={user.name}
              image={user.image}
              followerCount={user.followerCount}
              isFollowing={user.isFollowing}
              thumbnails={user.thumbnails}
              description={user.description}
              isBlocking={user.isBlocking}
              isBlocked={user.isBlocked}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
