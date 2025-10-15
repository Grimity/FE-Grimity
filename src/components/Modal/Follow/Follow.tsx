import { useState, useRef, useEffect } from "react";
import styles from "./Follow.module.scss";
import { useMyFollower, useMyFollowing } from "@/api/users/getMeFollow";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import { useModalStore } from "@/states/modalStore";
import { deleteMyFollowers } from "@/api/users/deleteMeFollowers";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";
import { FollowProps } from "./Follow.types";
import { useDeviceStore } from "@/states/deviceStore";

export default function Follow({ initialTab }: FollowProps) {
  const [activeTab, setActiveTab] = useState<"follower" | "following">(initialTab);
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const closeModal = useModalStore((state) => state.closeModal);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const route = useRouter();
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();

  const {
    data: followerData,
    fetchNextPage: fetchMoreFollowers,
    hasNextPage: hasNextFollowers,
    isFetching: isFetchingFollowers,
    refetch: refetchFollower,
  } = useMyFollower({ size: 10 });

  const {
    data: followingData,
    fetchNextPage: fetchMoreFollowings,
    hasNextPage: hasNextFollowings,
    isFetching: isFetchingFollowings,
    refetch: refetchFollowing,
  } = useMyFollowing({ size: 10 });

  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFetchMoreFollowers = async () => {
    if (hasNextFollowers && !isFetchingFollowers && !isFetchingData) {
      setIsFetchingData(true);
      await fetchMoreFollowers();
      setIsFetchingData(false);
    }
  };

  const handleFetchMoreFollowings = async () => {
    if (hasNextFollowings && !isFetchingFollowings && !isFetchingData) {
      setIsFetchingData(true);
      await fetchMoreFollowings();
      setIsFetchingData(false);
    }
  };

  const handleTabChange = (tab: "follower" | "following") => {
    setActiveTab(tab);
  };

  const data =
    activeTab === "follower"
      ? followerData?.pages.flatMap((page) => page.followers) || []
      : followingData?.pages.flatMap((page) => page.followings) || [];

  const hasNextPage = activeTab === "follower" ? hasNextFollowers : hasNextFollowings;
  const isFetching = activeTab === "follower" ? isFetchingFollowers : isFetchingFollowings;

  useEffect(() => {
    if (!tabsRef.current) return;

    const tabs = tabsRef.current.getElementsByClassName(styles.tab);
    const activeTabElement = tabs[activeTab === "follower" ? 0 : 1];

    if (activeTabElement) {
      const tabOffsetLeft = (activeTabElement as HTMLElement).offsetLeft;
      setIndicatorPosition(tabOffsetLeft);
    }
  }, [activeTab]);

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
  }, [activeTab, hasNextPage, isFetching, isFetchingData]);

  const handleClickUser = (url: string) => {
    route.push(`${url}`);
    closeModal();
  };

  const handleDeleteFollow = async (id: string) => {
    try {
      if (activeTab === "follower") {
        await deleteMyFollowers(id);
        showToast("해당 팔로워를 삭제했습니다.", "success");
        refetchFollower();
      } else {
        await deleteFollow({ id });
        showToast("언팔로우 되었습니다.", "success");
        refetchFollowing();
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs} ref={tabsRef}>
        <div
          className={`${styles.tab} ${activeTab === "follower" ? styles.active : ""}`}
          onClick={() => handleTabChange("follower")}
        >
          팔로워
        </div>
        <div
          className={`${styles.tab} ${activeTab === "following" ? styles.active : ""}`}
          onClick={() => handleTabChange("following")}
        >
          팔로잉
        </div>
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorPosition}px)`,
          }}
        />
      </div>
      <div className={styles.tabContent}>
        <ul>
          {data.length === 0 ? (
            <p className={styles.noData}>
              {activeTab === "follower" ? "아직 팔로워가 없어요" : "아직 팔로잉하는 유저가 없어요"}
            </p>
          ) : (
            data.map((follow, index) => (
              <li key={index} className={styles.item}>
                {follow.image !== null ? (
                  <Image
                    src={follow.image}
                    width={isMobile ? 40 : 50}
                    height={isMobile ? 40 : 50}
                    quality={50}
                    onClick={() => handleClickUser(follow.url)}
                    className={styles.image}
                    alt={`${activeTab === "follower" ? "팔로워" : "팔로잉"} 프로필 이미지`}
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={isMobile ? 40 : 50}
                    height={isMobile ? 40 : 50}
                    quality={50}
                    onClick={() => handleClickUser(follow.url)}
                    className={styles.image}
                    alt={`${activeTab === "follower" ? "팔로워" : "팔로잉"} 프로필 이미지`}
                    unoptimized
                  />
                )}
                {follow.description !== "" ? (
                  <div
                    className={styles.nameDescription}
                    onClick={() => handleClickUser(follow.url)}
                  >
                    <p className={styles.name}>{follow.name}</p>
                    <p className={styles.description}>{follow.description}</p>
                  </div>
                ) : (
                  <div className={styles.nameContainer} onClick={() => handleClickUser(follow.url)}>
                    <p className={styles.name}>{follow.name}</p>
                  </div>
                )}
                {activeTab === "follower" ? (
                  <div className={follow.description !== "" ? styles.btn : styles.btnCenter}>
                    <Button
                      type="outlined-assistive"
                      size="s"
                      onClick={() => handleDeleteFollow(follow.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ) : (
                  <div className={follow.description !== "" ? styles.btn : styles.btnCenter}>
                    <Button
                      type="outlined-assistive"
                      size="s"
                      onClick={() => handleDeleteFollow(follow.id)}
                    >
                      언팔로우
                    </Button>
                  </div>
                )}
              </li>
            ))
          )}
          {hasNextPage && <div ref={observerRef} style={{ height: "20px" }} />}
        </ul>
      </div>
    </div>
  );
}
