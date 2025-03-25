import IconComponent from "@/components/Asset/Icon";
import styles from "./ProfileCard.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProfileCardProps } from "./ProfileCard.types";
import Link from "next/link";
import { formattedDate } from "@/utils/formatDate";

export default function ProfileCard({
  title,
  cards = [],
  thumbnail,
  likeCount,
  commentCount,
  id,
  createdAt,
  viewCount,
}: ProfileCardProps) {
  const hasMultipleImages = cards && cards.length > 1;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {hasMultipleImages && (
          <div className={styles.overlapIcon}>
            <IconComponent name="overlap" size={24} />
          </div>
        )}
        <Link href={`/feeds/${id}`}>
          <img src={thumbnail} alt={title} loading="lazy" className={styles.image} />
        </Link>
      </div>
      <div className={styles.infoContainer}>
        <Link href={`/feeds/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        <div className={styles.profileContainer}>
          <div className={styles.countContainer}>
            <div className={styles.likeContainer}>
              <IconComponent name="likeCount" size={16} color="gray40" />
              <p className={styles.count}>{formatCurrency(likeCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="commentCount" size={16} color="gray40" />
              <p className={styles.count}>{formatCurrency(commentCount)}</p>
            </div>
            <div className={styles.likeContainer}>
              <IconComponent name="viewCount" size={16} color="gray40" />
              <p className={styles.count}>{formatCurrency(viewCount)}</p>
            </div>
          </div>
          <p className={styles.author}>{formattedDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
