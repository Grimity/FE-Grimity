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
import { authState } from "@/states/authState";

export default function RecommendCard({
  id,
  url,
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
      <Link href={`/${url}`}>
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            {thumbnails[0] ? (
              <div className={styles.background}>
                <img
                  src={thumbnails[0]}
                  alt="인기 유저 헤더 이미지"
                  loading="lazy"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px 0 0 0",
                  }}
                />
              </div>
            ) : (
              <div className={styles.background}>
                <img
                  src="/image/thumbnail.png"
                  loading="lazy"
                  alt="인기 유저 헤더 이미지"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px 0 0 0",
                  }}
                />
              </div>
            )}
          </div>
          <div className={styles.imageContainer}>
            {thumbnails[1] ? (
              <div className={styles.background}>
                <img
                  src={thumbnails[1]}
                  alt="인기 유저 헤더 이미지"
                  loading="lazy"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0 12px 0 0",
                  }}
                />
              </div>
            ) : (
              <div className={styles.background}>
                <img
                  src="/image/thumbnail.png"
                  loading="lazy"
                  alt="인기 유저 헤더 이미지"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0 12px 0 0",
                  }}
                />
              </div>
            )}
          </div>
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
        <p className={styles.description}>{description}</p>
        {id !== user_id &&
          (isFollowing ? (
            <Button size="m" type="outlined-assistive" onClick={handleUnfollowClick}>
              팔로잉
            </Button>
          ) : (
            <Button
              size="m"
              type="filled-primary"
              leftIcon={<IconComponent name="addFollow" size={16} />}
              onClick={handleFollowClick}
            >
              팔로우
            </Button>
          ))}
      </div>
    </div>
  );
}
