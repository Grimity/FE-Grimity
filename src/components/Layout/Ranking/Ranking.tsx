import { useRef, useState } from "react";
import Link from "next/link";

import { subWeeks } from "date-fns";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { useRankings } from "@/api/feeds/getRankings";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";

import Album from "@/components/common/Card/Album/Album";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";
import Title from "@/components/Layout/Title/Title";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import { PATH_ROUTES } from "@/constants/routes";

import { formattedDate } from "@/utils/formatDate";

import type { AlbumRank } from "@/components/common/Card/Album/Album.types";

import styles from "./Ranking.module.scss";

const RANK_BADGE_COUNT = 4;

export default function Ranking() {
  const today = new Date();

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const swiperRef = useRef<SwiperRef>(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const { data, isLoading } = useRankings({
    startDate: formattedDate(subWeeks(today, 1), "yyyy-MM-dd"),
    endDate: formattedDate(today, "yyyy-MM-dd"),
  });

  useGlobalLoading(isLoading);

  const paginatedFeeds = data?.feeds || [];
  const isEmpty = paginatedFeeds.length === 0;

  return (
    <div className={styles.container}>
      <Title link={PATH_ROUTES.RANKING}>주간 랭킹</Title>
      {isEmpty ? (
        <p className={styles.message}>아직 등록된 그림이 없어요</p>
      ) : (
        <div className={styles.rankingContainer}>
          <div className={`${styles.navButton} ${styles.left}`} aria-hidden={isBeginning}>
            <IconButton
              variant="outlined"
              icon={<Icon name="chevron-left" size={16} color="gray-bold"/>}
              aria-label="이전 슬라이드"
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              disabled={isBeginning}
            />
          </div>

          <Swiper
            ref={swiperRef}
            spaceBetween={16}
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
            {paginatedFeeds.map((feed, idx) => {
              const rank = idx < RANK_BADGE_COUNT ? ((idx + 1) as AlbumRank) : undefined;
              const isLiked = feed.isLike ?? false;

              return (
                <SwiperSlide key={feed.id}>
                  <Link href={`/feeds/${feed.id}`} className={styles.cardLink}>
                    <Album
                      variant={rank ? "rank" : "mainTitle"}
                      rank={rank}
                      imageUrl={feed.thumbnail}
                      title={feed.title}
                      nickname={feed.author?.name ?? ""}
                      likeCount={feed.likeCount}
                      viewCount={feed.viewCount}
                      isLiked={isLiked}
                      onLikeClick={
                        isLoggedIn ? () => toggleLike({ id: feed.id, isLiked }) : undefined
                      }
                    />
                  </Link>
                </SwiperSlide>
              );
            })} 
          </Swiper>

          <div className={`${styles.navButton} ${styles.right}`} aria-hidden={isEnd}>
            <IconButton
              variant="outlined"
              icon={<Icon name="chevron-right" size={16} color="gray-bold" />}
              aria-label="다음 슬라이드"
              onClick={() => swiperRef.current?.swiper.slideNext()}
              disabled={isEnd}
            />
          </div>
        </div>
      )}
    </div>
  );
}
