import { useRouter } from "next/router";

import { useFollowingFeeds } from "@/api/feeds/getFeedsFollowing";
import { useMyData } from "@/api/users/getMe";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import Empty from "@/components/common/Empty/Empty";
import FollowingFeed from "@/components/FollowingPage/FollowingFeed/FollowingFeed";
import PopularUsers from "@/components/FollowingPage/PopularUsers/PopularUsers";

import { PATH_ROUTES } from "@/constants/routes";

import styles from "@/components/FollowingPage/FollowingPage.module.scss";

export default function FollowingPage() {
  const router = useRouter();

  const { data: myData, isLoading: isMyDataLoading } = useMyData();
  const hasFollowing = Boolean(myData && myData.followingCount > 0);

  const {
    data: feedData,
    isLoading: isFeedLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowingFeeds({ size: 3 }, hasFollowing);

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage),
    isFetching: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  const isLoading = isMyDataLoading || (hasFollowing && isFeedLoading);
  useGlobalLoading(isLoading);

  if (isLoading) return null;

  const feeds = feedData?.pages.flatMap((page) => page.feeds) ?? [];

  if (!hasFollowing || feeds.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContent}>
          <Empty
            size="xl"
            iconName="illust-user"
            title={hasFollowing ? "아직 올라온 그림이 없어요" : "팔로우한 작가가 없어요"}
            content="관심 있는 작가를 팔로우하고 새로운 작품 소식을 받아보세요"
            buttonLabel="인기 그림 보러가기"
            onButtonClick={() => router.push(PATH_ROUTES.RANKING)}
          />
          <PopularUsers />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.feedContent}>
        {feeds.map((feed) => (
          <FollowingFeed key={feed.id} feed={feed} />
        ))}
        {hasNextPage && <div ref={loadMoreRef} />}
      </div>
    </div>
  );
}
