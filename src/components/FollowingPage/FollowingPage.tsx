import { useEffect, useRef, useState } from "react";
import { useFollowingFeeds } from "@/api/feeds/getFeedsFollowing";
import styles from "./FollowingPage.module.scss";
import FollowingFeed from "./FollowingFeed/FollowingFeed";
import Loader from "../Layout/Loader/Loader";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "@/states/authState";
import { modalState } from "@/states/modalState";
import Title from "../Layout/Title/Title";
import { usePopular } from "@/api/users/getPopular";
import RecommendCard from "./RecommendCard/RecommendCard";
import { useUserData } from "@/api/users/getId";

export default function FollowingPage() {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { data: myData } = useUserData(user_id);
  const setModal = useSetRecoilState(modalState);
  const { data: recommendData, isLoading: recommendIsLoading } = usePopular();
  const [randomUsers, setRandomUsers] = useState<any[]>([]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    isLoggedIn && myData && myData.followingCount > 0
      ? useFollowingFeeds({ size: 3 })
      : {
          data: null,
          isLoading: false,
          fetchNextPage: () => {},
          hasNextPage: false,
          isFetchingNextPage: false,
        };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastFeedElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastFeedElement.current && observer.current) {
      observer.current.disconnect();
    }

    if (lastFeedElement.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );

      observer.current.observe(lastFeedElement.current);
    }

    return () => {
      if (observer.current && lastFeedElement.current) {
        observer.current.unobserve(lastFeedElement.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (recommendData) {
      const randomData = [...recommendData].sort(() => Math.random() - 0.5).slice(0, 8);
      setRandomUsers(randomData);
    }
  }, [recommendData]);

  if (!isLoggedIn) {
    setModal({ isOpen: true, type: "LOGIN" });
    return null;
  }

  if (isLoading || recommendIsLoading) return <Loader />;

  const isFeedEmpty =
    !data || data.pages.length === 0 || data.pages.every((page) => page.feeds?.length === 0); // 피드가 없을 경우

  const isFollowingEmpty = myData?.followingCount === 0;

  return (
    <div className={styles.container}>
      {isFollowingEmpty ? (
        // 팔로잉 유저가 없을 경우
        <div className={styles.emptyContainer}>
          <section className={styles.messageContainer}>
            <p className={styles.message}>아직 팔로우하는 작가가 없네요!</p>
            <p className={styles.submessage}>
              관심 있는 작가를 팔로우하고, 새로운 작품 소식을 받아보세요.
            </p>
          </section>
          <section className={styles.recommendContainer}>
            <Title>추천 작가</Title>
            <div className={styles.cards}>
              {randomUsers.map((user) => (
                <RecommendCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  image={user.image}
                  description={user.description}
                  followerCount={user.followerCount}
                  isFollowing={user.isFollowing}
                  thumbnails={user.thumbnails}
                />
              ))}
            </div>
          </section>
        </div>
      ) : isFeedEmpty ? (
        // 팔로잉 유저는 있지만 피드가 없을 경우
        <div className={styles.emptyContainer}>
          <section className={styles.messageContainer}>
            <p className={styles.message}>아직 올라온 그림이 없어요!</p>
            <p className={styles.submessage}>
              관심 있는 작가를 팔로우하고 새로운 작품 소식을 받아보세요
            </p>
          </section>
          <section className={styles.recommendContainer}>
            <Title>추천 작가</Title>
            <div className={styles.cards}>
              {randomUsers.map((user) => (
                <RecommendCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  image={user.image}
                  description={user.description}
                  followerCount={user.followerCount}
                  isFollowing={user.isFollowing}
                  thumbnails={user.thumbnails}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        // 팔로잉 유저가 있고 피드도 있을 경우
        <div className={styles.center}>
          <div className={styles.feedsContainer}>
            {data.pages.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.feeds.map((feed) => (
                  <FollowingFeed key={feed.id} id={feed.id} />
                ))}
              </div>
            ))}
          </div>
          {hasNextPage && !isFetchingNextPage && <div ref={lastFeedElement}></div>}
        </div>
      )}
    </div>
  );
}
