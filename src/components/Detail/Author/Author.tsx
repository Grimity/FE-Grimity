import styles from "./Author.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/states/authStore";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { AuthorProps } from "./Author.types";
import { useUserData } from "@/api/users/getId";
import Button from "@/components/Button/Button";
import { useUserForDetail } from "@/api/users/getIdFeeds";
import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import Loader from "@/components/Layout/Loader/Loader";
import { useDeviceStore } from "@/states/deviceStore";
import { useRouter } from "next/router";

export default function Author({ authorId, authorUrl, feedId }: AuthorProps) {
  const { data: userData } = useUserData(authorId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const divRef = usePreventRightClick<HTMLDivElement>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const { showToast } = useToast();
  const { isMobile } = useDeviceStore();
  const { pathname } = useRouter();

  useEffect(() => {
    if (userData && userData.isFollowing !== undefined) {
      setIsFollowing(userData.isFollowing);
      setFollowerCount(userData.followerCount);
    }
  }, [userData]);
  const size = isMobile ? 2 : 4;
  const { data, isLoading, refetch } = useUserForDetail({
    id: authorId,
    size: size,
    sort: "latest",
  });
  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  useEffect(() => {
    refetch();
  }, [pathname]);

  const feeds = data?.feeds || [];

  if (isLoading) {
    return <Loader />;
  }

  const handleFollowClick = async (id: string) => {
    try {
      await putFollow({ id });
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async (id: string) => {
    try {
      await deleteFollow({ id });
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          <div className={styles.spaceBetween}>
            <div className={styles.profileContainer}>
              <Link href={`/${authorUrl}`}>
                <div className={styles.profileLeft}>
                  {userData.image !== null ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      className={styles.authorImage}
                      width={40}
                      height={40}
                      quality={50}
                      style={{ objectFit: "cover" }}
                      unoptimized
                      ref={imgRef}
                    />
                  ) : (
                    <Image
                      src="/image/default.svg"
                      width={40}
                      height={40}
                      alt="프로필 이미지"
                      className={styles.authorImage}
                      quality={50}
                      style={{ objectFit: "cover" }}
                      unoptimized
                      ref={imgRef}
                    />
                  )}
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{userData.name}</p>
                    <div className={styles.follower}>
                      팔로워
                      <p className={styles.followerColor}>{formatCurrency(followerCount)}</p>
                    </div>
                  </div>
                </div>
              </Link>
              {isLoggedIn &&
                user_id !== userData.id &&
                (isFollowing ? (
                  <Button
                    size="m"
                    type="outlined-assistive"
                    onClick={() => handleUnfollowClick(userData.id)}
                  >
                    팔로잉
                  </Button>
                ) : (
                  <Button
                    size="m"
                    type="filled-primary"
                    onClick={() => handleFollowClick(userData.id)}
                  >
                    팔로우
                  </Button>
                ))}
            </div>
            {!isMobile && (
              <Link href={`/${authorUrl}`}>
                <p className={styles.seeMore}>작품 더보기</p>
              </Link>
            )}
          </div>
          <div className={styles.cardList} ref={divRef}>
            {feeds.map((feed) => (
              <SquareCard
                key={feed.id}
                id={feed.id}
                title={feed.title}
                thumbnail={feed.thumbnail}
                cards={feed.cards}
                author={userData}
                likeCount={feed.likeCount}
                viewCount={feed.viewCount}
                isSame={feed.id === feedId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
