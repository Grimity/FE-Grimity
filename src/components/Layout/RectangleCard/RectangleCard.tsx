import { useState } from "react";
import IconComponent from "@/components/Asset/Icon";
import styles from "./RectangleCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { RectangleCardProps } from "./RectangleCard.types";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import { isMobileState, isTabletState } from "@/states/isMobileState";

export default function RectangleCard({
  id,
  title,
  content,
  thumbnail,
  author,
  likeCount: initialLikeCount,
  commentCount,
  createdAt,
  isLike: initialIsLike,
}: RectangleCardProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  const [isLiked, setIsLiked] = useState(initialIsLike);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      await deleteLike(id);
      setLikeCount((prev) => prev - 1);
    } else {
      await putLike(id);
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.container}>
      {!isMobile ? (
        <>
          <div className={styles.imageContainer}>
            {isLoggedIn && (
              <div className={styles.likeBtn} onClick={handleLikeClick}>
                <IconComponent name={isLiked ? "cardLikeOn" : "cardLikeOff"} isBtn size={24} />
              </div>
            )}
            <Link href={`/feeds/${id}`}>
              <img src={thumbnail} alt={title} loading="lazy" className={styles.image} />
            </Link>
          </div>
          {!isTablet ? (
            <div className={styles.infoContainer}>
              <Link href={`/feeds/${id}`}>
                <h3 className={styles.title}>{title}</h3>
              </Link>
              <p className={styles.content}>{content}</p>
              <div className={styles.profileContainer}>
                <div className={styles.informationContainer}>
                  <p className={styles.createdAt}>{timeAgo(createdAt)}</p>
                  <IconComponent name="cardDot" size={2} />
                  <div className={styles.countContainer}>
                    <div className={styles.likeContainer}>
                      <IconComponent name="likeCount" size={16} />
                      <p className={styles.count}>{formatCurrency(likeCount)}</p>
                    </div>
                    <div className={styles.likeContainer}>
                      <IconComponent name="commentCount" size={16} />
                      <p className={styles.count}>{formatCurrency(commentCount)}</p>
                    </div>
                  </div>
                </div>
                {author && (
                  <Link href={`/${author.url}`}>
                    <div className={styles.profile}>
                      {author.image !== "https://image.grimity.com/null" ? (
                        <Image
                          src={author.image}
                          alt={author.name}
                          width={24}
                          height={24}
                          quality={50}
                          className={styles.profileImage}
                          unoptimized
                        />
                      ) : (
                        <Image
                          src="/image/default.svg"
                          width={24}
                          height={24}
                          quality={50}
                          alt="프로필 이미지"
                          className={styles.profileImage}
                          unoptimized
                        />
                      )}
                      <p className={styles.author}>{author.name}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.tablet}>
              <Link href={`/feeds/${id}`}>
                <h3 className={styles.title}>{title}</h3>
              </Link>
              {author && (
                <Link href={`/${author.url}`}>
                  <div className={styles.profile}>
                    {author.image !== "https://image.grimity.com/null" ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={24}
                        height={24}
                        quality={50}
                        className={styles.profileImage}
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/image/default.svg"
                        width={24}
                        height={24}
                        quality={50}
                        alt="프로필 이미지"
                        className={styles.profileImage}
                        unoptimized
                      />
                    )}
                    <p className={styles.author}>{author.name}</p>
                  </div>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className={styles.mobileContainer}>
          <div className={styles.imageContainer}>
            {isLoggedIn && (
              <div className={styles.likeBtn} onClick={handleLikeClick}>
                <IconComponent name={isLiked ? "cardLikeOn" : "cardLikeOff"} isBtn size={24} />
              </div>
            )}
            <Link href={`/feeds/${id}`}>
              <Image
                src={thumbnail}
                alt={title}
                fill
                quality={75}
                className={styles.image}
                unoptimized
              />
            </Link>
          </div>
          <div className={styles.cardData}>
            {author && (
              <div className={styles.profile}>
                {author.image !== "https://image.grimity.com/null" ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={24}
                    height={24}
                    quality={50}
                    className={styles.profileImage}
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={24}
                    height={24}
                    alt="프로필 이미지"
                    quality={50}
                    className={styles.profileImage}
                    unoptimized
                  />
                )}
                <p className={styles.author}>{author.name}</p>
              </div>
            )}
            <Link href={`/feeds/${id}`}>
              <h3 className={styles.title}>{title}</h3>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
