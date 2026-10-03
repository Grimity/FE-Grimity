import styles from "./Author.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { useAuthStore } from "@/states/authStore";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";
import { AuthorProps } from "./Author.types";
import { useUserData } from "@/api/users/getId";
import { useUserForDetail } from "@/api/users/getIdFeeds";
import Loader from "@/components/Layout/Loader/Loader";
import { useRouter } from "next/router";
import Link from "next/link";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Icon from "@/components/common/Icon/Icon";
import Album from "@/components/common/Card/Album/Album";

export default function Author({ authorId, authorUrl }: AuthorProps) {
  const { data: userData } = useUserData(authorId);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const { showToast } = useToast();
  const router = useRouter();
  const profileHref = `/${authorUrl}`;

  useEffect(() => {
    if (userData && userData.isFollowing !== undefined) {
      setIsFollowing(userData.isFollowing);
      setFollowerCount(userData.followerCount);
    }
  }, [userData]);

  const { data, isLoading, refetch } = useUserForDetail({
    id: authorId,
    size: 6,
    sort: "latest",
  });
  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  useEffect(() => {
    refetch();
  }, [router.pathname]);

  const feeds = data?.feeds || [];

  if (isLoading) {
    return <Loader />;
  }

  const handleFollowClick = async (id: string) => {
    try {
      await putFollow({ id });
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async (id: string) => {
    try {
      await deleteFollow({ id });
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          <UserItem
            type="follow"
            profileImage={userData.image ?? undefined}
            nickname={userData.name}
            followerCount={formatCurrency(followerCount)}
            onClick={() => router.push(profileHref)}
          >
            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
              <OutlinedButton size="regular" onClick={() => router.push(profileHref)}>
                작품 보기
              </OutlinedButton>
              {isLoggedIn &&
                user_id !== userData.id &&
                (isFollowing ? (
                  <SolidButton size="regular" onClick={() => handleUnfollowClick(userData.id)}>
                    팔로잉
                  </SolidButton>
                ) : (
                  <SolidButton size="regular" onClick={() => handleFollowClick(userData.id)}>
                    팔로우
                  </SolidButton>
                ))}
            </div>
          </UserItem>
          <Swiper
            className={styles.slide}
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode
            grabCursor
            mousewheel={{ forceToAxis: true }}
          >
            {feeds.map((feed) => (
              <SwiperSlide key={feed.id} className={styles.slideItem}>
                <Album
                  variant="mainTitle"
                  imageUrl={feed.thumbnail}
                  title={feed.title}
                  nickname={userData.name}
                  likeCount={feed.likeCount}
                  viewCount={feed.viewCount}
                  feedHref={`/feeds/${feed.id}`}
                  profileHref={profileHref}
                  authorUrl={authorUrl}
                />
              </SwiperSlide>
            ))}
            {feeds.length >= 4 && (
              <SwiperSlide className={styles.moreSlide}>
                <Link href={profileHref} className={styles.moreButton}>
                  <span className={styles.moreCircle}>
                    <Icon name="chevron-right" size={24} color="primary-normal" />
                  </span>
                  <span className={styles.moreLabel}>작품 더보기</span>
                </Link>
              </SwiperSlide>
            )}
          </Swiper>
        </>
      )}
    </div>
  );
}
