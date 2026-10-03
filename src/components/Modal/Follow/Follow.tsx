import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import {
  useMeGetMyFollowersInfinite,
  useMeGetMyFollowingsInfinite,
  getMeGetMyFollowersInfiniteQueryKey,
  getMeGetMyFollowingsInfiniteQueryKey,
} from "@/api/generated/me/me";
import { useUserFollow, useUserUnfollow } from "@/api/generated/users/users";
import type { MyFollowersResponse, MyFollowingsResponse } from "@/api/generated/model";
import { useModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useToast } from "@/hooks/useToast";
import { useUserCardFollow } from "@/hooks/useCardInteraction";
import { PATH_ROUTES } from "@/constants/routes";

import Tab from "@/components/common/SegmentedControl/Tab/Tab";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";
import Empty from "@/components/common/Empty/Empty";
import Divider from "@/components/common/Divider/Divider";

import { FollowProps } from "./Follow.types";
import styles from "./Follow.module.scss";

const PAGE_SIZE = 10;

interface FollowRow {
  id: string;
  name: string;
  image: string | null;
  url: string;
  isFollowing: boolean;
}

function FollowToggleButton({
  isFollowing,
  onToggle,
}: {
  isFollowing: boolean;
  onToggle: () => void;
}) {
  const { isFollowing: following, handleFollowClick } = useUserCardFollow(isFollowing, onToggle);

  return following ? (
    <OutlinedButton size="small" onClick={handleFollowClick}>
      팔로잉 중
    </OutlinedButton>
  ) : (
    <SolidButton size="small" onClick={handleFollowClick}>
      팔로잉
    </SolidButton>
  );
}

export default function Follow({ initialTab, title }: FollowProps) {
  const [activeTab, setActiveTab] = useState<"follower" | "following">(initialTab);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const closeModal = useModalStore((state) => state.closeModal);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const route = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isMobile } = useDeviceStore();

  const followersParams = { size: PAGE_SIZE };
  const followingsParams = { size: PAGE_SIZE };

  const {
    data: followerData,
    fetchNextPage: fetchMoreFollowers,
    hasNextPage: hasNextFollowers,
    isFetching: isFetchingFollowers,
  } = useMeGetMyFollowersInfinite(followersParams, {
    query: {
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  });

  const {
    data: followingData,
    fetchNextPage: fetchMoreFollowings,
    hasNextPage: hasNextFollowings,
    isFetching: isFetchingFollowings,
  } = useMeGetMyFollowingsInfinite(followingsParams, {
    query: {
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  });

  const { mutate: followUser } = useUserFollow();
  const { mutate: unfollowUser } = useUserUnfollow();

  const handleFetchMoreFollowers = useCallback(async () => {
    if (hasNextFollowers && !isFetchingFollowers && !isFetchingData) {
      setIsFetchingData(true);
      await fetchMoreFollowers();
      setIsFetchingData(false);
    }
  }, [hasNextFollowers, isFetchingFollowers, isFetchingData, fetchMoreFollowers]);

  const handleFetchMoreFollowings = useCallback(async () => {
    if (hasNextFollowings && !isFetchingFollowings && !isFetchingData) {
      setIsFetchingData(true);
      await fetchMoreFollowings();
      setIsFetchingData(false);
    }
  }, [hasNextFollowings, isFetchingFollowings, isFetchingData, fetchMoreFollowings]);

  const handleTabChange = (tab: "follower" | "following") => {
    setActiveTab(tab);
  };

  const data: FollowRow[] =
    activeTab === "follower"
      ? (followerData?.pages.flatMap((page) => page.followers) ?? []).map((follower) => ({
          id: follower.id,
          name: follower.name,
          image: follower.image,
          url: follower.url,
          isFollowing: follower.isFollowing,
        }))
      : (followingData?.pages.flatMap((page) => page.followings) ?? []).map((following) => ({
          id: following.id,
          name: following.name,
          image: following.image,
          url: following.url,
          isFollowing: true,
        }));

  const hasNextPage = activeTab === "follower" ? hasNextFollowers : hasNextFollowings;
  const isFetching = activeTab === "follower" ? isFetchingFollowers : isFetchingFollowings;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching && !isFetchingData) {
          if (activeTab === "follower") {
            handleFetchMoreFollowers();
          } else {
            handleFetchMoreFollowings();
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      },
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [
    activeTab,
    hasNextPage,
    isFetching,
    isFetchingData,
    handleFetchMoreFollowers,
    handleFetchMoreFollowings,
  ]);

  const handleClickUser = (url: string) => {
    route.push(`/${url}`);
    closeModal();
  };

  const handleToggleFollow = (userId: string, isFollowing: boolean) => {
    if (!isLoggedIn) {
      showToast("로그인 후 팔로우할 수 있어요.", "error");
      return;
    }

    const followersQueryKey = getMeGetMyFollowersInfiniteQueryKey(followersParams);
    const followingsQueryKey = getMeGetMyFollowingsInfiniteQueryKey(followingsParams);

    if (activeTab === "follower") {
      // 팔로워 탭: 맞팔로우 여부만 바뀌므로 목록엔 그대로 남기고 버튼 상태만 토글
      queryClient.setQueryData<InfiniteData<MyFollowersResponse>>(followersQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            followers: page.followers.map((follower) =>
              follower.id === userId ? { ...follower, isFollowing: !isFollowing } : follower,
            ),
          })),
        };
      });
    } else {
      // 팔로잉 탭: 언팔로우하면 더 이상 "내가 팔로우 중"이 아니므로 목록에서 제거
      queryClient.setQueryData<InfiniteData<MyFollowingsResponse>>(followingsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            followings: page.followings.filter((following) => following.id !== userId),
          })),
        };
      });
    }

    const invalidateBoth = () => {
      queryClient.invalidateQueries({ queryKey: followersQueryKey });
      queryClient.invalidateQueries({ queryKey: followingsQueryKey });
    };

    if (isFollowing) {
      unfollowUser({ id: userId }, { onError: invalidateBoth, onSuccess: invalidateBoth });
    } else {
      followUser({ id: userId }, { onError: invalidateBoth, onSuccess: invalidateBoth });
    }
  };

  return (
    <>
      {!isMobile && title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <IconButton
            variant="sm"
            className={styles.closeButton}
            icon={<Icon name="x" size={24} />}
            onClick={closeModal}
            aria-label="닫기"
          />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.tabBar}>
          <div className={styles.tabs} role="tablist">
            <Tab
              size="lg"
              active={activeTab === "following"}
              title="팔로잉"
              showNumber={false}
              onClick={() => handleTabChange("following")}
            />
            <Tab
              size="lg"
              active={activeTab === "follower"}
              title="팔로워"
              showNumber={false}
              onClick={() => handleTabChange("follower")}
            />
          </div>
          <Divider />
        </div>
        <div className={styles.tabContent}>
          {data.length === 0 ? (
            <Empty
              className={styles.empty}
              size="md"
              iconName="illust-user"
              title={
                activeTab === "follower"
                  ? "빛나는 나를 알아본 사람이 아직 없어요"
                  : "팔로우한 작가가 없어요"
              }
              buttonLabel={activeTab === "follower" ? "그림 올리기" : "인기 그림 둘러보기"}
              onButtonClick={() => {
                route.push(activeTab === "follower" ? "/write" : PATH_ROUTES.RANKING);
                closeModal();
              }}
            />
          ) : (
            <ul className={styles.list}>
              {data.map((user, index) => (
                <li key={`${user.id}-${index}`}>
                  <UserItem
                    type="id"
                    profileImage={user.image ?? undefined}
                    nickname={user.name}
                    userId={user.url}
                    onClick={() => handleClickUser(user.url)}
                  >
                    <FollowToggleButton
                      isFollowing={user.isFollowing}
                      onToggle={() => handleToggleFollow(user.id, user.isFollowing)}
                    />
                  </UserItem>
                </li>
              ))}
              {hasNextPage && <div ref={observerRef} style={{ height: "20px" }} />}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
