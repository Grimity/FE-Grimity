import { useState } from "react";
import { PopularResponse } from "@/api/users/getPopular";
import styles from "./User.module.scss";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { putFollow } from "@/api/users/putIdFollow";
import { deleteFollow } from "@/api/users/deleteIdFollow";

export default function User({
  id,
  url,
  name,
  image,
  followerCount: initialFollowerCount,
  isFollowing: initialIsFollowing,
  thumbnails,
}: PopularResponse) {
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
    } catch (error) {
      showToast("로그인 후 가능합니다.", "warning");
    }
  };

  return (
    <div className={styles.container}>
      <Link href={`/${url}`}>
        <div className={styles.imageWrapper}>
          {thumbnails[0] ? (
            <img
              src={thumbnails[0]}
              width={150}
              height={150}
              loading="lazy"
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          ) : (
            <img
              src="/image/thumbnail.png"
              width={150}
              height={150}
              loading="lazy"
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          )}
          {thumbnails[1] ? (
            <img
              src={thumbnails[1]}
              width={150}
              height={150}
              loading="lazy"
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          ) : (
            <img
              src="/image/thumbnail.png"
              width={150}
              height={150}
              loading="lazy"
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          )}
        </div>
      </Link>
      <div className={styles.profileWrapper}>
        <Link href={`/${url}`}>
          <div className={styles.profileLeft}>
            {image !== "https://image.grimity.com/null" ? (
              <Image
                src={image}
                width={24}
                height={24}
                quality={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
                unoptimized
              />
            ) : (
              <Image
                src="/image/default.svg"
                width={24}
                height={24}
                quality={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
                unoptimized
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
    </div>
  );
}
