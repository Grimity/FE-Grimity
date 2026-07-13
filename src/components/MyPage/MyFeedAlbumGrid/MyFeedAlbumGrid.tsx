import { useRouter } from "next/router";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { MyLikeFeedsResponse } from "@grimity/dto";

import { useAuthStore } from "@/states/authStore";
import { useFeedsLikeMutation } from "@/queries/feeds/useFeedsLikeMutation";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";

import { PATH_ROUTES } from "@/constants/routes";

import styles from "./MyFeedAlbumGrid.module.scss";

interface MyFeedAlbumGridProps {
  query: UseInfiniteQueryResult<InfiniteData<MyLikeFeedsResponse>, Error>;
  emptyTitle: string;
}

export default function MyFeedAlbumGrid({ query, emptyTitle }: MyFeedAlbumGridProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { mutate: toggleLike } = useFeedsLikeMutation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = query;

  useGlobalLoading(isLoading);

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isLoading) return null;

  const feeds = data?.pages.flatMap((page) => page.feeds) ?? [];

  if (feeds.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Empty
          iconName="illust-result-null"
          title={emptyTitle}
          buttonLabel="인기 그림 둘러보기"
          onButtonClick={() => router.push(PATH_ROUTES.RANKING)}
        />
      </div>
    );
  }

  return (
    <>
      <section className={styles.grid}>
        {feeds.map((feed) => (
          <Album
            key={feed.id}
            variant="mainTitle"
            linkHref={`${PATH_ROUTES.FEEDS}/${feed.id}`}
            imageUrl={feed.thumbnail}
            title={feed.title}
            nickname={feed.author?.name ?? ""}
            likeCount={feed.likeCount}
            viewCount={feed.viewCount}
            isLiked
            onLikeClick={
              isLoggedIn ? () => toggleLike({ id: feed.id, isLiked: true }) : undefined
            }
          />
        ))}
      </section>
      <div ref={loadMoreRef} />
    </>
  );
}
