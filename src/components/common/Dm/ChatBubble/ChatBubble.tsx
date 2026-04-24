import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";

import styles from "./ChatBubble.module.scss";
import type { ChatBubbleProps } from "./ChatBubble.types";

const SAND_ICON = <Icon name="message" size={16} className={styles.sandIcon} />;

export default function ChatBubble({
  variant = "others",
  text,
  images,
  replyTo,
  isLiked = false,
  isHovered = false,
  isPending = false,
  showSlide = false,
  onLike,
  onReply,
  onMouseEnter,
  onMouseLeave,
  className,
}: ChatBubbleProps) {
  const isMine = variant === "mine";
  const hasImages = !!images && images.length > 0;
  const hasText = !!text;

  return (
    <div
      className={clsx(
        styles.container,
        isMine ? styles.containerMine : styles.containerOthers,
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {replyTo ? (
        <div
          className={clsx(
            styles.answerWrapper,
            isMine ? styles.alignEnd : styles.alignStart,
          )}
        >
          <span className={clsx(styles.answerLabel, isMine && styles.answerLabelEnd)}>
            {replyTo.target === "나"
              ? "나에게 답장"
              : `${replyTo.target}님에게 답장`}
          </span>
          <div className={styles.answerRow}>
            <Icon name="forward-2" size={16} className={styles.answerReplyIcon} />
            <div
              className={clsx(
                styles.answerPill,
                isMine ? styles.answerPillMine : styles.answerPillOthers,
              )}
            >
              <p className={styles.answerPillText}>{replyTo.text}</p>
            </div>
          </div>
        </div>
      ) : null}

      {hasImages ? (
        <div className={clsx(styles.imagesStack, isMine && styles.imagesStackMine)}>
          {images!.map((src, idx) => (
            <div key={`${src}-${idx}`} className={styles.imagesWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="첨부 이미지" className={styles.image} />
            </div>
          ))}
        </div>
      ) : null}

      {hasText ? (
        <div
          className={clsx(
            styles.wrapper,
            isMine && styles.wrapperMine,
            isLiked && styles.wrapperHeart,
            isPending && styles.wrapperSand,
          )}
        >
          <div className={clsx(styles.bubble, isMine ? styles.mine : styles.others)}>
            <p className={styles.text}>{text}</p>
            {isLiked ? (
              <div
                className={clsx(
                  styles.heartBadge,
                  isMine ? styles.heartBadgeMine : styles.heartBadgeOthers,
                )}
                aria-label="좋아요 표시"
              >
                <Icon name="heart-fill" size={12} className={styles.heartBadgeIcon} />
              </div>
            ) : null}
          </div>

          {isHovered ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={clsx(styles.actionBtn, isLiked && styles.actionBtnLiked)}
                onClick={onLike}
                aria-label="좋아요"
              >
                <Icon name={isLiked ? "heart-fill" : "heart"} size={20} />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={onReply}
                aria-label="답장"
              >
                <Icon name="forward-2" size={20} />
              </button>
            </div>
          ) : null}

          {showSlide ? (
            <button
              type="button"
              className={styles.slideBtn}
              onClick={onReply}
              aria-label="답장"
            >
              <Icon name="forward-2" size={20} />
            </button>
          ) : null}

          {isPending && isMine ? SAND_ICON : null}
        </div>
      ) : null}
    </div>
  );
}
