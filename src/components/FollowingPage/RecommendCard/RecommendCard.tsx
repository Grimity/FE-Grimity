import { useState } from "react";
import { PopularResponse } from "@/api/users/getPopular";
import styles from "./RecommendCard.module.scss";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { putFollow } from "@/api/users/putIdFollow";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import IconComponent from "@/components/Asset/Icon";
import { useRecoilValue } from "recoil";
import { isMobileState } from "@/states/isMobileState";
import { authState } from "@/states/authState";

export default function RecommendCard({
  id,
  name,
  image,
  description,
  followerCount: initialFollowerCount,
  isFollowing: initialIsFollowing,
  thumbnails,
}: PopularResponse) {
  const { user_id } = useRecoilValue(authState);
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const isMobile = useRecoilValue(isMobileState);

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } catch (error) {
      showToast("오류가 발생했습니다.", "error");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    } catch (error) {
      showToast("오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/users/${id}`}>
        <div className={styles.imageWrapper}>
          {thumbnails[0] ? (
            <Image
              src={thumbnails[0]}
              width={isMobile ? 180 : 128}
              height={isMobile ? 180 : 128}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          ) : (
            <Image
              src="/image/thumbnail.png"
              width={isMobile ? 180 : 128}
              height={isMobile ? 180 : 128}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          )}
          {thumbnails[1] ? (
            <Image
              src={thumbnails[1]}
              width={isMobile ? 180 : 128}
              height={isMobile ? 180 : 128}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          ) : (
            <Image
              src="/image/thumbnail.png"
              width={isMobile ? 180 : 128}
              height={isMobile ? 180 : 128}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          )}
        </div>
      </Link>
      <div className={styles.profileWrapper}>
        <Link href={`/users/${id}`}>
          <div className={styles.profileLeft}>
            {image !== "https://image.grimity.com/null" ? (
              <Image
                src={image}
                width={50}
                height={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
              />
            ) : (
              <Image
                src="/image/default.svg"
                width={50}
                height={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
              />
            )}
            <div className={styles.nameContainer}>
              <p className={styles.name}>{name}</p>
              <div className={styles.follower}>
                팔로워<p className={styles.followerCount}>{followerCount}</p>
              </div>
            </div>
          </div>
        </Link>
        <p className={styles.description}>{description}</p>
        {id !== user_id && isFollowing ? (
          <Button size="m" type="outlined-assistive" onClick={handleUnfollowClick}>
            팔로잉
          </Button>
        ) : (
          <Button
            size="m"
            type="filled-primary"
            leftIcon={<IconComponent name="addFollow" width={16} height={16} />}
            onClick={handleFollowClick}
          >
            팔로우
          </Button>
        )}
      </div>
    </div>
  );
}
