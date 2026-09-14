import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  useUserGetFeedsInfinite,
  getUserGetFeedsInfiniteQueryKey,
} from "@/api/generated/users/users";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import { PAGE_SIZE, type SortOption } from "../constants";

/**
 * 그림 탭의 목록 상태(정렬·앨범 필터·무한 스크롤)를 관리한다.
 */
export function useProfileFeeds(userId: string) {
  const { pathname } = useRouter();

  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);

  const feedsParams = {
    sort: sortBy,
    size: PAGE_SIZE,
    albumId: activeAlbum ?? undefined,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useUserGetFeedsInfinite(userId, feedsParams, {
      query: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      },
    });

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  // 다른 프로필로 이동하거나 앨범을 바꾸면 목록을 다시 불러온다
  useEffect(() => {
    refetch();
  }, [pathname, activeAlbum]);

  const feeds =
    data?.pages.flatMap((page) =>
      page.feeds.map((feed) => ({
        ...feed,
        albumId: activeAlbum || undefined,
      })),
    ) || [];

  return {
    feeds,
    feedsQueryKey: getUserGetFeedsInfiniteQueryKey(userId, feedsParams),
    sortBy,
    activeAlbum,
    hasNextPage,
    loadMoreRef,
    changeSort: setSortBy,
    changeAlbum: setActiveAlbum,
    refetch,
  };
}
