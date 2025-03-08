import { useFeedsLatest } from "@/api/feeds/getFeedsLatest";
import SquareCard from "../SquareCard/SquareCard";
import Title from "../Title/Title";
import styles from "./NewFeed.module.scss";
import { useEffect, useRef } from "react";
import { NewFeedProps } from "./NewFeed.types";
import { useRouter } from "next/router";

export default function NewFeed({ isDetail = false }: NewFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeedsLatest({
    size: 20,
  });

  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages.length]);

  return (
    <div className={styles.container}>
      {isDetail ? <Title>추천 작품</Title> : <Title>최신 그림</Title>}
      <div className={styles.grid}>
        {data?.pages.map((page) =>
          page.feeds.map((feed) => (
            <SquareCard
              key={feed.id}
              id={feed.id}
              title={feed.title}
              thumbnail={feed.thumbnail}
              author={feed.author}
              likeCount={feed.likeCount}
              viewCount={feed.viewCount}
              isLike={feed.isLike}
            />
          )),
        )}
      </div>
      {hasNextPage && <div ref={observerRef} className={styles.loader} />}
    </div>
  );
}
