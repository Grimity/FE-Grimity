import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { useFeedsLatest } from "@/api/feeds/getFeedsLatest";
import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";

import Album from "@/components/common/Card/Album/Album";
import Title from "@/components/Layout/Title/Title";

import { NewFeedProps } from "@/components/Layout/NewFeed/NewFeed.types";

import styles from "@/components/Layout/NewFeed/NewFeed.module.scss";

export default function NewFeed({ isDetail = false }: NewFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFeedsLatest({
    size: 20,
  });

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: toggleLike } = useFeedsLikeMutation();

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
      <Title>최신 그림</Title>
      <div className={styles.grid}>
        {data?.pages.map((page) =>
          page.feeds.map((feed) => {
            const isLiked = feed.isLike ?? false;
            const authorUrl = feed.author?.url;

            return (
              <Album
                key={feed.id}
                variant="mainTitle"
                imageUrl={feed.thumbnail}
                title={feed.title}
                nickname={feed.author?.name ?? ""}
                likeCount={feed.likeCount}
                viewCount={feed.viewCount}
                isLiked={isLoggedIn ? isLiked : undefined}
                feedHref={`/feeds/${feed.id}`}
                profileHref={authorUrl ? `/${authorUrl}` : undefined}
                authorUrl={authorUrl ?? undefined}
                onLikeClick={
                  isLoggedIn
                    ? () => toggleLike({ id: feed.id, isLiked })
                    : undefined
                }
              />
            );
          }),
        )}
      </div>
      {hasNextPage && <div ref={observerRef} className={styles.loader} />}
    </div>
  );
}
