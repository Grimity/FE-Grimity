import { useRef, useState } from "react";

import { subWeeks } from "date-fns";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { useRankings } from "@/api/feeds/getRankings";

import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import Title from "@/components/Layout/Title/Title";
import IconComponent from "@/components/Asset/Icon";
import Loader from "@/components/Layout/Loader/Loader";

import { PATH_ROUTES } from "@/constants/routes";

import { formattedDate } from "@/utils/formatDate";

import styles from "./Ranking.module.scss";

export default function Ranking() {
  const today = new Date();

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const { data, isLoading } = useRankings({
    startDate: formattedDate(subWeeks(today, 1), "yyyy-MM-dd"),
    endDate: formattedDate(today, "yyyy-MM-dd"),
  });

  if (isLoading) return <Loader />;

  const paginatedFeeds = data?.feeds || [];
  const isEmpty = !data || data.feeds.length === 0;

  const handlePrevClick = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.swiper.slideNext();
  };

  return (
    <div className={styles.container}>
      <Title link={PATH_ROUTES.RANKING}>주간 랭킹</Title>
      {isEmpty ? (
        <p className={styles.message}>아직 등록된 그림이 없어요</p>
      ) : (
        <div className={styles.rankingContainer}>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrevClick}
            disabled={isBeginning}
            style={{
              visibility: isBeginning ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-left.svg"
              width={40}
              height={40}
              alt="왼쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>

          <Swiper
            ref={swiperRef}
            spaceBetween={12}
            slidesPerView={1.5}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            breakpoints={{
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
          >
            {paginatedFeeds.map((feed, idx) => (
              <SwiperSlide key={feed.id}>
                <div className={styles.cardWrapper}>
                  {idx < 4 && (
                    <div className={styles.rankingIconWrapper}>
                      <IconComponent
                        name={
                          idx === 0
                            ? "ranking1"
                            : idx === 1
                            ? "ranking2"
                            : idx === 2
                            ? "ranking3"
                            : "ranking4"
                        }
                        size={30}
                      />
                    </div>
                  )}
                  <SquareCard
                    id={feed.id}
                    title={feed.title}
                    thumbnail={feed.thumbnail}
                    author={feed.author}
                    likeCount={feed.likeCount}
                    viewCount={feed.viewCount}
                    isLike={feed.isLike}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNextClick}
            disabled={isEnd}
            style={{
              visibility: isEnd ? "hidden" : "visible",
            }}
          >
            <img
              src="/icon/card-arrow-right.svg"
              width={40}
              height={40}
              alt="오른쪽 버튼"
              className={styles.arrowBtn}
              loading="lazy"
            />
          </button>
        </div>
      )}
    </div>
  );
}
