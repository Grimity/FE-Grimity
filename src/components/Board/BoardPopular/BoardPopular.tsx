import React, { useEffect, useState } from "react";
import Title from "@/components/Layout/Title/Title";
import styles from "./BoardPopular.module.scss";
import { useTodayPopularPosts } from "@/api/posts/getTodayPopular";
import PopularCard from "./PopularCard/PopularCard";
import Loader from "@/components/Layout/Loader/Loader";
import { BoardPopularProps } from "./BoardPopular.types";
import { useRouter } from "next/router";
import { isTabletState } from "@/states/isMobileState";
import { useRecoilValue } from "recoil";

export default function BoardPopular({ isDetail, isMobileMain }: BoardPopularProps) {
  const { data, isLoading, refetch } = useTodayPopularPosts();
  const isTablet = useRecoilValue(isTabletState);
  const [pageIndex, setPageIndex] = useState(0);
  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  const POSTS_PER_PAGE = isDetail ? 3 : 4;
  const totalPages = Math.ceil((data?.length || 0) / POSTS_PER_PAGE);

  if (isLoading) {
    return <Loader />;
  }

  const startIdx = pageIndex * POSTS_PER_PAGE;
  const currentPageData = data?.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const handlePrevClick = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const handleNextClick = () => {
    if (pageIndex < totalPages - 1) setPageIndex(pageIndex + 1);
  };

  return (
    <div className={styles.container}>
      {isMobileMain ? (
        <Title link="/board">자유게시판 인기글</Title>
      ) : isDetail || isTablet ? (
        <Title link="/board">자유게시판 인기글</Title>
      ) : (
        <Title>오늘의 인기 글</Title>
      )}
      {currentPageData && currentPageData.length > 0 ? (
        <div className={isDetail ? styles.cardListDetail : styles.cardList}>
          {currentPageData?.map((post) => (
            <PopularCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className={styles.noResult}>아직 등록된 글이 없어요</p>
      )}
      {currentPageData && currentPageData.length > 0 && (
        <div className={styles.pagination}>
          <button
            className={`${styles.navButton} ${styles.left}`}
            onClick={handlePrevClick}
            disabled={pageIndex === 0}
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
          <div className={styles.pageDots}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === pageIndex && styles.active}`}
              />
            ))}
          </div>
          <button
            className={`${styles.navButton} ${styles.right}`}
            onClick={handleNextClick}
            disabled={pageIndex === totalPages - 1}
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
