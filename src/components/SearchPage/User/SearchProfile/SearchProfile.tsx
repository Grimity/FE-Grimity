import { useState } from "react";
import styles from "./SearchProfile.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { SearchProfileProps } from "./SearchProfile.types";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { putFollow } from "@/api/users/putIdFollow";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/Button/Button";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function SearchProfile({
  id,
  name,
  image,
  description,
  backgroundImage,
  followerCount: initialFollowerCount,
  isFollowing: initialIsFollowing,
}: SearchProfileProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  useIsMobile();

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/users/${id}`}>
        <div className={styles.cover}>
          {backgroundImage !== "https://image.grimity.com/null" ? (
            <Image
              src={backgroundImage}
              alt="배경이미지"
              width={630}
              height={isMobile ? 130 : isTablet ? 140 : 178}
              style={{
                width: "100%",
                height: isMobile ? "130px" : isTablet ? "140px" : "178px",
                objectFit: "cover",
              }}
              quality={75}
            />
          ) : (
            <Image
              src="/image/search-default-cover.svg"
              alt="배경이미지"
              width={630}
              height={isMobile ? 130 : isTablet ? 140 : 178}
              style={{
                width: "100%",
                height: isMobile ? "130px" : isTablet ? "140px" : "178px",
                objectFit: "cover",
              }}
              quality={75}
            />
          )}
        </div>
      </Link>
      <div className={styles.profile}>
        <Link href={`/users/${id}`}>
          {image !== "https://image.grimity.com/null" ? (
            <Image
              src={image}
              alt="프로필"
              width={64}
              height={64}
              quality={75}
              className={styles.image}
            />
          ) : (
            <Image
              src="/image/default.svg"
              alt="프로필"
              width={64}
              height={64}
              quality={50}
              className={styles.image}
            />
          )}
        </Link>
        <div className={styles.infoContainer}>
          <div className={styles.spaceBetween}>
            <div className={styles.nameCount}>
              <Link href={`/users/${id}`}>
                <p className={styles.name}>{name}</p>
              </Link>
              <div className={styles.follower}>
                팔로워<p className={styles.count}>{formatCurrency(followerCount)}</p>
              </div>
            </div>
            {isLoggedIn &&
              id !== user_id &&
              (isFollowing ? (
                <Button size="s" type="outlined-assistive" onClick={handleUnfollowClick}>
                  팔로잉
                </Button>
              ) : (
                <Button size="s" type="filled-primary" onClick={handleFollowClick}>
                  팔로우
                </Button>
              ))}
          </div>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}
