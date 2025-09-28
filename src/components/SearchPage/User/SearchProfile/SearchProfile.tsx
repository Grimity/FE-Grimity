import { useState, useContext } from "react";
import styles from "./SearchProfile.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/states/authStore";
import { SearchProfileProps } from "./SearchProfile.types";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/Button/Button";
import { useDeviceStore } from "@/states/deviceStore";
import { SearchHighlightContext } from "@/pages/search";

export default function SearchProfile({
  id,
  url,
  name,
  image,
  description,
  backgroundImage,
  followerCount: initialFollowerCount,
  isFollowing: initialIsFollowing,
}: SearchProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const { isMobile } = useDeviceStore();
  const { highlight } = useContext(SearchHighlightContext);

  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFollowClick = async () => {
    try {
      await putFollow({ id });
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow({ id });
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/${url}`}>
        <div className={styles.cover}>
          <img
            src={backgroundImage !== null ? backgroundImage : "/image/search-default-cover.svg"}
            alt="배경이미지"
            width={630}
            height={isMobile ? 130 : 150}
            style={{
              width: "100%",
              height: isMobile ? "130px" : "150px",
              objectFit: "cover",
            }}
            loading="lazy"
          />
        </div>
      </Link>
      <div className={styles.profile}>
        <div className={styles.topRow}>
          <Link href={`/${url}`}>
            <Image
              src={image !== null ? image : "/image/default.svg"}
              alt="프로필"
              width={64}
              height={64}
              quality={75}
              className={styles.image}
              unoptimized
            />
          </Link>
          {isLoggedIn && id !== user_id && (
            <div className={styles.followButton}>
              {isFollowing ? (
                <Button size="s" type="outlined-assistive" onClick={handleUnfollowClick}>
                  팔로잉
                </Button>
              ) : (
                <Button size="s" type="filled-primary" onClick={handleFollowClick}>
                  팔로우
                </Button>
              )}
            </div>
          )}
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.nameCount}>
            <Link href={`/${url}`}>
              <p className={styles.name}>{highlight(name)}</p>
            </Link>
            <div className={styles.follower}>
              팔로워<p className={styles.count}>{formatCurrency(followerCount)}</p>
            </div>
          </div>
          <p className={styles.description}>{highlight(description)}</p>
        </div>
      </div>
    </div>
  );
}
